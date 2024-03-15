#!/usr/bin/env python
# coding: utf-8

import pandas as pd
import json
import seaborn as sns
import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import os
from flask import Flask, jsonify, send_file, render_template
from flask_cors import CORS

app = Flask(__name__, static_url_path='/static', static_folder='Visualizations/graphs')
CORS(app)

def generate_images(json_path):
    if not os.path.exists('graphs'):
        os.makedirs('graphs')

    with open(json_path, "r") as file:
        # had to do it line by line. I don't know why it was different.
        df_arts = pd.read_json(file)

    with open(json_path, "r") as file:
        df_tracks = pd.read_json(file)

    df_tracks_unnested = df_tracks.explode('artist_name').explode('artist_id')

    # Converting timestamp to datetime
    df_tracks_unnested['played_at'] = pd.to_datetime(
        df_tracks_unnested['played_at'], format='%Y-%m-%dT%H:%M:%S', errors='coerce')

    # Merging
    merged = pd.merge(df_tracks_unnested, df_arts, on='artist_id', how='left')

    # Combine 'artist_name_x' and 'artist_name_y' into a single 'artist_name' column
    merged['artist_name'] = merged['artist_name_x'].combine_first(merged['artist_name_y'])

    # Drop unnecessary columns
    merged = merged.drop(['artist_name_x', 'artist_name_y', 'artist_id'], axis=1)
    # Excel can't handle datetimes with timezones. 
    merged['played_at'] = merged['played_at'].dt.tz_localize(None)

    merged.describe()
    
    # Group by 'track_name' and keep only the times played.
    cleaned_df = merged.groupby('track_name').agg(
        artist_name=('artist_name', 'first'),
        plays=('played_at', 'nunique')         
    ).reset_index()
    cleaned_df

    merged.columns.values.tolist()

    # Group by 'track_name' and calculate the total time listening for each track
    artists = merged.groupby('track_name').agg(
        artist_name=('artist_name', 'first'),
        plays=('played_at', 'nunique'),
        song_length_ms=('duration_ms', 'first')  # Assuming you want the first played time for each track
    ).reset_index()

    # Convert duration_ms to seconds
    artists['duration_hours'] = artists['song_length_ms'] / (1000 * 60 * 60)

    # Calculate total time listening by multiplying plays with duration in seconds
    artists['total_time_listening'] = artists['plays'] * artists['duration_hours']

    artist_stats = artists.groupby('artist_name').agg(
        total_listening_time=('total_time_listening', 'sum')
    ).reset_index()

    # Sort by total listening time in descending order to find the most played artists
    most_played_artists = artist_stats.sort_values(by='total_listening_time', ascending=False).head(25)

    # Display the resulting DataFrame with the top fifteen most played artists
    most_played_artists

    # Explicit vs nonExplicit songs.
    explicit_counts = merged['explicit'].value_counts()
    plt.pie(explicit_counts, labels=explicit_counts.index, autopct='%1.1f%%', startangle=90, colors=['lightcoral', 'lightskyblue'])
    plt.title('Explicit vs Non-Explicit Tracks')
    plt.savefig('graphs/explicit_vs_nonexplicit.png')  # Save the pie chart as an image
    plt.close()  # Close the current figure

    sns.set(style='whitegrid')

    # Create a horizontal bar chart with seaborn
    plt.figure(figsize=(10, 8))
    sns.barplot(x='total_listening_time', y='artist_name', data=most_played_artists, palette='viridis')
    plt.xlabel('Total Listening Time (hours)')
    plt.ylabel('Artist Name')
    plt.title('Top 25 Most Played Artists by Total Listening Time')
    plt.tight_layout()
    plt.savefig('graphs/top_artists_total_listening_time.png')  # Save the bar chart as an image
    plt.close()  # Close the current figure

    # Barchart for most played songs.
    top25 = cleaned_df.sort_values(by='plays', ascending=False).head(25)
    plt.figure(figsize=(10, 8))
    bar_chart = sns.barplot(x='plays', y='track_name', data=top25, palette='viridis', orient='h')

    # Set labels and title
    plt.xlabel('Track Name')
    plt.ylabel('Number of Plays')
    plt.title('Top 25 Songs by Number of Plays')

    # Rotate x-axis labels for better readability
    plt.xticks(rotation=45, ha='right')

    plt.savefig('graphs/top_songs_by_plays.png')  # Save the bar chart as an image
    plt.close()  # Close the current figure

    # Total Plays by day
    merged_copy = merged.copy()

    # Extract hour of the day and day of the week information
    merged_copy['time_of_day'] = merged_copy['played_at'].dt.hour
    merged_copy['day_of_week'] = merged_copy['played_at'].dt.day_name()

    # Group by 'time_of_day' and 'day_of_week'
    grouped_df = merged_copy.groupby(['time_of_day', 'day_of_week']).agg(plays=('played_at', 'nunique')).reset_index()

    # Adjust plays for all days
    grouped_df['plays'] = grouped_df['plays'] / 7

    # Create a line plot
    plt.figure(figsize=(12, 8))
    sns.lineplot(data=grouped_df, x='time_of_day', y='plays', hue='day_of_week', markers=True, dashes=False)

    # Set labels and title
    plt.title("Number of Listens per Hour of the Day (All Days)")
    plt.xlabel("Hour")
    plt.ylabel("Plays")
    plt.gca().yaxis.set_major_formatter(mdates.DateFormatter('%H:%M:%S'))

    plt.savefig('graphs/listens_per_hour.png')  # Save the line plot as an image
    plt.close()  # Close the current figure

    image_dir = 'graphs'
    image_paths = {
        "explicitVsNonexplicit": os.path.join(image_dir, 'explicit_vs_nonexplicit.png'),
        "listensPerHour": os.path.join(image_dir, 'listens_per_hour.png'),
        "topArtistsTotal": os.path.join(image_dir, 'top_artists_total_listening_time.png'),
        "topSongsByPlays": os.path.join(image_dir, 'top_songs_by_plays.png')
    }
    # Construct image URLs
    backend_url = "http://localhost:5000"  # Change this to your backend URL
    image_urls = {key: f"{backend_url}/{key}" for key in image_paths}
    return image_urls

# Route to generate image URLs
@app.route('/api/visuals', methods=['GET'])
def generate_images_endpoint():
    image_urls = generate_images("data/spotify_artist_2017-06-30.json")
    return jsonify(image_urls)

# Route to display individual images
@app.route('/image/<image_name>')
def display_image(image_name):
    # Assuming images are located in the 'graphs' directory
    image_path = os.path.join('graphs', image_name + '.png')
    return send_file(image_path, mimetype='image/png')

# Route to display a page with just the image
@app.route('/image_page/<image_name>')
def display_image_page(image_name):
    # Render a template with the image displayed
    return render_template('image_page.html', image_name=image_name)

if __name__ == "__main__":
    app.run(debug=True)

    
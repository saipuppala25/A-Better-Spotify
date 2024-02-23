import streamlit as st
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os

# Function to process data
def process_data(df_tracks, df_arts):
    df_tracks_unnested = df_tracks.explode('artist_name').explode('artist_id')
    df_tracks_unnested['played_at'] = pd.to_datetime(df_tracks_unnested['played_at'], format='%Y-%m-%dT%H:%M:%S', errors='coerce')
    merged = pd.merge(df_tracks_unnested, df_arts, on='artist_id', how='left')
    merged['artist_name'] = merged['artist_name_x'].combine_first(merged['artist_name_y'])
    merged = merged.drop(['artist_name_x', 'artist_name_y', 'artist_id'], axis=1)
    merged['played_at'] = merged['played_at'].dt.tz_localize(None)
    return merged

# Function to create explicit vs non-explicit pie chart
def create_explicit_chart(merged):
    explicit_counts = merged['explicit'].value_counts()
    fig, ax = plt.subplots()
    plt.pie(explicit_counts, labels=explicit_counts.index, autopct='%1.1f%%', startangle=90, colors=['lightcoral', 'lightskyblue'])
    plt.title('Explicit vs Non-Explicit Tracks')
    st.pyplot(fig)

# Function to create top artists bar chart
def create_top_artists_chart(artists):
    sns.set(style='whitegrid')
    fig, ax = plt.subplots(figsize=(10, 8))
    sns.barplot(x='total_listening_time', y='artist_name', data=artists, palette='viridis', ax=ax)
    plt.xlabel('Total Listening Time (hours)')
    plt.ylabel('Artist Name')
    plt.title('Top 25 Most Played Artists by Total Listening Time')
    plt.tight_layout()
    st.pyplot(fig)

# Function to create top songs bar chart
def create_top_songs_chart(top25):
    fig, ax = plt.subplots(figsize=(10, 8))
    bar_chart = sns.barplot(x='plays', y='track_name', data=top25, palette='viridis', orient='h', ax=ax)
    plt.xlabel('Track Name')
    plt.ylabel('Number of Plays')
    plt.title('Top 25 Songs by Number of Plays')
    plt.xticks(rotation=45, ha='right')
    st.pyplot(fig)

# Function to create listens per hour line plot
def create_listens_per_hour_chart(merged_copy):
    merged_copy['time_of_day'] = merged_copy['played_at'].dt.hour
    merged_copy['day_of_week'] = merged_copy['played_at'].dt.day_name()
    grouped_df = merged_copy.groupby(['time_of_day', 'day_of_week']).agg(plays=('played_at', 'nunique')).reset_index()
    grouped_df['plays'] = grouped_df['plays'] / 7
    plt.figure(figsize=(12, 8))
    sns.lineplot(data=grouped_df, x='time_of_day', y='plays', hue='day_of_week', markers=True, dashes=False)
    plt.title("Number of Listens per Hour of the Day (All Days)")
    plt.xlabel("Hour")
    plt.ylabel("Plays")
    
    # Set the current global figure explicitly
    st.pyplot(plt.gcf())
    plt.close()

def main():
    st.title("Streamlit Spotify Analysis")

    # Upload JSON files
    st.sidebar.title("Upload JSON Files")
    tracks_file = st.sidebar.file_uploader("Upload Tracks JSON", type=["json"])
    arts_file = st.sidebar.file_uploader("Upload Artists JSON", type=["json"])

    artists = None  # Initialize artists outside the if condition

    if tracks_file is not None and arts_file is not None:
        # Load data from uploaded JSON files
        df_tracks = pd.read_json(tracks_file)
        df_arts = pd.read_json(arts_file)

        # Process data
        merged = process_data(df_tracks, df_arts)

        # Create and display charts
        st.sidebar.title("Select Analysis")
        selected_chart = st.sidebar.radio("Choose Analysis", ["Explicit vs Non-Explicit", "Top Artists", "Top Songs", "Listens per Hour"])

        if selected_chart == "Explicit vs Non-Explicit":
            create_explicit_chart(merged)
        elif selected_chart == "Top Artists":
            artists = merged.groupby('artist_name').agg(
                total_listening_time=('duration_ms', 'sum')
            ).reset_index()
            most_played_artists = artists.sort_values(by='total_listening_time', ascending=False).head(25)
            create_top_artists_chart(most_played_artists)
        elif selected_chart == "Top Songs":
            cleaned_df = merged.groupby('track_name').agg(
                plays=('played_at', 'nunique')
            ).reset_index()
            top25 = cleaned_df.sort_values(by='plays', ascending=False).head(25)
            create_top_songs_chart(top25)
        elif selected_chart == "Listens per Hour":
            merged_copy = merged.copy()

            # Extract hour of the day and day of the week information
            merged_copy['hour'] = merged_copy['played_at'].dt.hour
            merged_copy['day_of_week'] = merged_copy['played_at'].dt.day_name()

            create_listens_per_hour_chart(merged_copy)

if __name__ == "__main__":
    main()

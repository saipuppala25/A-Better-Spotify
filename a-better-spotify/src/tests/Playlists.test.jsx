import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewPlaylist from '../component/NewPlaylist';
import * as apiService from "../service/apiService"; 

jest.mock("../service/apiService", () => ({
  fetchWebApi: jest.fn(() => Promise.resolve({ id: 'playlist123' }))
}));

describe('NewPlaylist Component Tests', () => {
  beforeEach(() => {
    
    apiService.fetchWebApi.mockClear();
    apiService.fetchWebApi.mockResolvedValueOnce({ id: 'user123' }) // fetching user details
               .mockResolvedValueOnce({ id: 'playlist123' }); // creating the playlist
  });

  it('calls createPlaylist logic upon clicking the "Create Playlist" button', async () => {
    const dummyToken = "dummyToken";
    render(<NewPlaylist token={dummyToken} />);

    fireEvent.click(screen.getByRole('button', { name: /create playlist/i }));

    await waitFor(() => {
      // check if the fetchWebApi mock function was called correctly
      expect(apiService.fetchWebApi).toHaveBeenCalledWith(
        dummyToken, expect.stringContaining('v1/me'), 'GET'
      );
      expect(apiService.fetchWebApi).toHaveBeenCalledWith(
        dummyToken, expect.stringContaining('v1/users/user123/playlists'), 'POST',
        expect.objectContaining({
          name: "My New Playlist",
          description: "A playlist created from recommendations.",
          public: false
        })
      );
    });
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TopTracks from '../component/TopTracks';
import { fetchWebApi } from "../service/apiService";

jest.mock("../service/apiService", () => ({
  fetchWebApi: jest.fn()
}));

describe('TopTracks Component', () => {
  const fakeResponse = { items: [] }; 

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    fetchWebApi.mockClear();
    fetchWebApi.mockResolvedValue(fakeResponse);
  });

  test.each([
    ['12 Months', 'long_term'],
    ['6 Months', 'medium_term'],
    ['1 Month', 'short_term'],
  ])('fetches top tracks with %s time range', async (label, term) => {
    render(<TopTracks token="dummyToken" />);

    // Simulate clicking the time range button
    fireEvent.click(screen.getByText(label));

    // Check if fetchWebApi was called with the correct parameters
    expect(fetchWebApi).toHaveBeenCalledWith(
      "dummyToken", expect.stringContaining(term), 'GET'
    );
  });
});

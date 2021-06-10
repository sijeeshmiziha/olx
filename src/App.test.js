import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('./firebase/config', () => ({
  Firebase: {
    auth: () => ({
      onAuthStateChanged: (callback) => {
        callback(null);
        return () => {};
      },
    }),
  },
}));

test('App renders and shows default route content after auth loads', async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });
});

test('home route shows sell link', async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText(/SELL/i)).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, CardDescription, CardHeader, CardTitle } from './card';

describe('When rendering a Card', () => {
  it('exposes the title as a heading', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Overnight stays</CardTitle>
          <CardDescription>Your dog sleeps at a vetted sitter</CardDescription>
        </CardHeader>
      </Card>,
    );

    expect(screen.getByRole('heading', { name: /overnight stays/i })).toBeInTheDocument();
  });

  it('lets the caller choose the heading level with the as prop', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle as="h2">Overnight stays</CardTitle>
        </CardHeader>
      </Card>,
    );

    expect(screen.getByRole('heading', { level: 2, name: /overnight stays/i })).toBeInTheDocument();
  });

  it('lets the caller choose the heading level through asChild', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle asChild>
            <h2>Overnight stays</h2>
          </CardTitle>
        </CardHeader>
      </Card>,
    );

    expect(screen.getByRole('heading', { level: 2, name: /overnight stays/i })).toBeInTheDocument();
  });
});

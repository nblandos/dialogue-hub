import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../../../components/footer/Footer';

describe('Footer', () => {
  const setup = () =>
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

  it('renders navigation links with correct paths', () => {
    setup();
    const links = {
      Home: '/',
      Book: '/book',
      Menu: '/menu',
      'Training Videos': '/training',
    };

    Object.entries(links).forEach(([text, path]) => {
      expect(screen.getByText(text)).toHaveAttribute('href', path);
    });
  });

  it('renders external links with correct attributes', () => {
    setup();
    const externalLinks = [
      { text: 'Facebook', url: 'https://www.facebook.com/dialoguehublondon' },
      { text: 'Instagram', url: 'https://www.instagram.com/dialogue.hub' },
      {
        text: 'LinkedIn',
        url: 'https://www.linkedin.com/company/dialogue-hub',
      },
      { text: 'Email', url: 'mailto:info@dialoguehub.co.uk' },
    ];

    externalLinks.forEach(({ text, url }) => {
      const link = screen.getByText(text);
      expect(link).toHaveAttribute('href', url);
      if (!url.startsWith('mailto:')) {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });

    const addressLink = screen.getByText(/Royal Docks/i).closest('a');
    expect(addressLink).toHaveAttribute(
      'href',
      'https://maps.app.goo.gl/VGoxjPeSubwj8Cga7'
    );
  });

  it('has correct responsive layout', () => {
    const { container } = setup();

    const logo = screen.getByAltText('Dialogue Hub Logo');
    expect(logo).toHaveAttribute('src', 'Logo.png');
    expect(logo).toHaveClass('logo-image');

    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('flex-col', 'md:flex-row');
    expect(screen.getByText('Home').closest('div')).toHaveClass(
      'justify-center',
      'md:justify-start'
    );
    expect(screen.getByText(/Royal Docks/i).closest('div')).toHaveClass(
      'text-center',
      'md:text-right'
    );
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ScreenReaderToggle from '../../../components/header/ScreenReaderToggle';

describe('ScreenReaderToggle', () => {
  let mockSetIsScreenReaderOn;
  let mockSpeechSynthesis;
  let mockMutationObserverInstance;
  let MutationObserverMock;

  beforeEach(() => {
    mockSetIsScreenReaderOn = vi.fn();

    mockSpeechSynthesis = { cancel: vi.fn(), speak: vi.fn() };
    window.speechSynthesis = mockSpeechSynthesis;
    global.SpeechSynthesisUtterance = vi.fn();

    mockMutationObserverInstance = { observe: vi.fn(), disconnect: vi.fn() };
    MutationObserverMock = vi.fn((cb) => {
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
        trigger: (mutations) => cb(mutations),
      };
    });
    global.MutationObserver = MutationObserverMock;

    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderToggle = (props = {}) => {
    const defaultProps = {
      isScreenReaderOn: false,
      setIsScreenReaderOn: mockSetIsScreenReaderOn,
      ...props,
    };
    return render(
      <BrowserRouter>
        <ScreenReaderToggle {...defaultProps} />
      </BrowserRouter>
    );
  };

  it('renders mobile and desktop icons', () => {
    renderToggle();
    expect(screen.getByTestId('screen-reader-icon-mobile')).toBeInTheDocument();
    expect(
      screen.getByTestId('screen-reader-icon-desktop')
    ).toBeInTheDocument();
  });

  it('has correct accessibility label', () => {
    renderToggle();
    expect(screen.getByRole('switch')).toHaveAttribute(
      'aria-label',
      'Toggle screen reader mode'
    );
  });

  it('toggles screen reader and updates localStorage', () => {
    renderToggle({ isScreenReaderOn: false });
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(mockSetIsScreenReaderOn).toHaveBeenCalledWith(true);
    expect(localStorage.getItem('screenReader')).toBe('true');
  });

  it('cancels speech synthesis when screen reader is toggled off', () => {
    const { rerender } = renderToggle({ isScreenReaderOn: true });
    rerender(
      <BrowserRouter>
        <ScreenReaderToggle
          isScreenReaderOn={false}
          setIsScreenReaderOn={mockSetIsScreenReaderOn}
        />
      </BrowserRouter>
    );
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
  });

  it('reads text on hover when enabled', () => {
    // append dummy element before rendering toggle so that it is selected
    const dummyElement = document.createElement('div');
    dummyElement.setAttribute('data-screen-reader-text', 'Test hover text');
    document.body.appendChild(dummyElement);

    renderToggle({ isScreenReaderOn: true });
    fireEvent.mouseOver(dummyElement);

    expect(global.SpeechSynthesisUtterance).toHaveBeenCalled();
    expect(global.SpeechSynthesisUtterance.mock.calls[0][0]).toBe(
      'Test hover text'
    );
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    expect(mockSpeechSynthesis.speak).toHaveBeenCalled();

    document.body.removeChild(dummyElement);
  });

  it('reads text on focus when enabled', () => {
    const dummyElement = document.createElement('div');
    dummyElement.setAttribute('data-screen-reader-text', 'Test focus text');
    document.body.appendChild(dummyElement);

    renderToggle({ isScreenReaderOn: true });
    fireEvent.focus(dummyElement);

    expect(global.SpeechSynthesisUtterance).toHaveBeenCalled();
    expect(global.SpeechSynthesisUtterance.mock.calls[0][0]).toBe(
      'Test focus text'
    );
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    expect(mockSpeechSynthesis.speak).toHaveBeenCalled();

    document.body.removeChild(dummyElement);
  });

  it('sets up mutation observer when screen reader is enabled', () => {
    renderToggle({ isScreenReaderOn: true });
    expect(MutationObserverMock).toHaveBeenCalledTimes(1);
  });

  it('reconnects event listeners on mutation observer callback', () => {
    const dummyElement = document.createElement('div');
    dummyElement.setAttribute('data-screen-reader-text', 'Reconnection test');
    const spyAdd = vi.spyOn(dummyElement, 'addEventListener');
    const spyRemove = vi.spyOn(dummyElement, 'removeEventListener');
    document.body.appendChild(dummyElement);

    renderToggle({ isScreenReaderOn: true });
    expect(spyAdd).toHaveBeenCalledWith('mouseover', expect.any(Function));
    expect(spyAdd).toHaveBeenCalledWith('focus', expect.any(Function));

    const observerCallback = MutationObserverMock.mock.calls[0][0];
    observerCallback();

    expect(spyRemove).toHaveBeenCalledWith('mouseover', expect.any(Function));
    expect(spyRemove).toHaveBeenCalledWith('focus', expect.any(Function));
    expect(spyAdd).toHaveBeenCalledWith('mouseover', expect.any(Function));
    expect(spyAdd).toHaveBeenCalledWith('focus', expect.any(Function));

    document.body.removeChild(dummyElement);
  });

  it('cleans up mutation observer and event listeners on unmount', () => {
    const disconnectSpy = vi.fn();
    MutationObserverMock.mockImplementationOnce((cb) => ({
      observe: vi.fn(),
      disconnect: disconnectSpy,
    }));

    const { unmount } = renderToggle({ isScreenReaderOn: true });
    unmount();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('does not read text when conditions are not met', () => {
    const testCases = [
      { isScreenReaderOn: false, text: 'Test text' },
      { isScreenReaderOn: true, text: '' },
      { isScreenReaderOn: false, text: '' },
    ];

    testCases.forEach(({ isScreenReaderOn, text }) => {
      const dummyElement = document.createElement('div');
      dummyElement.setAttribute('data-screen-reader-text', text);
      document.body.appendChild(dummyElement);

      renderToggle({ isScreenReaderOn });
      fireEvent.mouseOver(dummyElement);

      expect(global.SpeechSynthesisUtterance).not.toHaveBeenCalled();
      expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled();

      document.body.removeChild(dummyElement);
      vi.clearAllMocks();
    });
  });
});

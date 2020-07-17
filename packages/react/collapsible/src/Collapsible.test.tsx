import React from 'react';
import { axe } from 'jest-axe';
import { render, fireEvent } from '@testing-library/react';
import { Collapsible } from './Collapsible';

const BUTTON_TEXT = 'Button';
const CONTENT_TEXT = 'Content';

const CollapsibleTest = (props: React.ComponentProps<typeof Collapsible>) => (
  <Collapsible {...props}>
    <Collapsible.Button>{BUTTON_TEXT}</Collapsible.Button>
    <Collapsible.Content>{CONTENT_TEXT}</Collapsible.Content>
  </Collapsible>
);

describe('given a default Collapsible', () => {
  let rendered: ReturnType<typeof render>;
  let button: HTMLElement;

  beforeEach(() => {
    rendered = render(<CollapsibleTest />);
    button = rendered.getByText(BUTTON_TEXT);
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should render a button', () => {
    expect(button).toBeInTheDocument();
  });

  describe('when clicking the button', () => {
    let content: HTMLElement;

    beforeEach(() => {
      fireEvent.click(button);
      content = rendered.getByText(CONTENT_TEXT);
    });

    it('should open the content', () => {
      expect(content).toBeVisible();
    });

    describe('and clicking the button again', () => {
      beforeEach(() => {
        fireEvent.click(button);
      });

      it('should close the content', () => {
        expect(content).not.toBeVisible();
      });
    });
  });
});

describe('given a disabled Collapsible', () => {
  let rendered: ReturnType<typeof render>;

  beforeEach(() => {
    rendered = render(<CollapsibleTest disabled />);
  });

  it('should render a disabled button', () => {
    const button = rendered.getByText(BUTTON_TEXT);
    expect(button).toBeDisabled();
  });
});

describe('given an open uncontrolled Collapsible', () => {
  let rendered: ReturnType<typeof render>;
  let content: HTMLElement;
  const onToggle = jest.fn();

  beforeEach(() => {
    rendered = render(<CollapsibleTest defaultIsOpen={true} onToggle={onToggle} />);
    content = rendered.getByText(CONTENT_TEXT);
  });

  it('should render with open content', () => {
    expect(content).toBeVisible();
  });

  describe('when clicking the button', () => {
    beforeEach(() => {
      const button = rendered.getByText(BUTTON_TEXT);
      fireEvent.click(button);
    });

    it('should call `onToggle` prop with `false` value', () => {
      expect(onToggle).toHaveBeenCalledWith(false);
    });

    it('should close the content', () => {
      expect(content).not.toBeVisible();
    });
  });
});

describe('given an open controlled Collapsible', () => {
  let rendered: ReturnType<typeof render>;
  let content: HTMLElement;
  const onToggle = jest.fn();

  beforeEach(() => {
    rendered = render(<CollapsibleTest isOpen={true} onToggle={onToggle} />);
    content = rendered.getByText(CONTENT_TEXT);
  });

  it('should render with open content', () => {
    expect(content).toBeVisible();
  });

  describe('when clicking the button', () => {
    beforeEach(() => {
      const button = rendered.getByText(BUTTON_TEXT);
      fireEvent.click(button);
    });

    it('should call `onToggle` prop with `false` value', () => {
      expect(onToggle).toHaveBeenCalledWith(false);
    });

    it('should not close the content', () => {
      expect(content).toBeVisible();
    });
  });
});

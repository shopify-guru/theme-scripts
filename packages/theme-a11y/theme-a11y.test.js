/**
 * @jest-environment jsdom
 */

import path from 'path';
import {
  forceFocus,
  focusHash,
  bindInPageLinks,
  focusable,
  trapFocus,
  removeTrapFocus
} from './theme-a11y';

describe('forceFocus()', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<div id="nonFocusableElement"></div>' +
      '<button id="focusableElement" tabIndex=3 class="myClass">';
  });

  test('is a function exported by theme-a11y.js', () => {
    expect(typeof forceFocus).toBe('function');
  });

  test("adds a 'tabindex=-1' attribute", () => {
    const nonFocusableElement = document.getElementById('nonFocusableElement');
    const focusableElement = document.getElementById('focusableElement');

    forceFocus(nonFocusableElement);
    expect(nonFocusableElement.tabIndex).toBe(-1);

    forceFocus(focusableElement);
    expect(focusableElement.tabIndex).toBe(-1);
  });

  test('reserves the original tabindex value in a data-tabIndex attribute', () => {
    const focusableElement = document.getElementById('focusableElement');

    focusableElement.tabIndex = 3;
    forceFocus(focusableElement);

    expect(parseInt(focusableElement.dataset.tabIndex)).toBe(3);
  });

  test('adds a focus state', () => {
    const focusableElement = document.getElementById('focusableElement');

    forceFocus(focusableElement);

    expect(document.activeElement).toBe(focusableElement);
  });

  test('adds an overrided class name', () => {
    const focusableElement = document.getElementById('focusableElement');
    const customClass = 'custom-class';
    forceFocus(focusableElement, { className: customClass });

    expect(focusableElement.classList.contains(customClass)).toBeTruthy();
  });

  test('resets the element to its original state on blur', () => {
    const focusableElement = document.getElementById('focusableElement');
    const nonFocusableElement = document.getElementById('nonFocusableElement');
    const clone = focusableElement.cloneNode(true);

    forceFocus(focusableElement);
    forceFocus(nonFocusableElement);

    expect(focusableElement).toEqual(clone);
  });
});

describe('focusHash()', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<div id="nonFocusableElement"></div>' +
      '<button id="focusableElement" tabIndex=3 class="myClass">';
  });

  test('is a function exported by theme-a11y.js', () => {
    expect(typeof focusHash).toBe('function');
  });

  test('focuses an element whose ID is specified in the URL hash', () => {
    const focusableElement = document.getElementById('focusableElement');

    window.location.hash = 'focusableElement';
    focusHash();

    expect(document.activeElement).toBe(focusableElement);
  });

  test('does not change the focus if element specified does not exist', () => {
    const focusableElement = document.getElementById('focusableElement');

    window.location.hash = 'otherElement';
    forceFocus(focusableElement);
    focusHash();

    expect(document.activeElement).toBe(focusableElement);
  });
});

describe('bindInPageLinks()', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<a id="link" href="#title"></a>' +
      '<a id="invalidLink1" href="#"></a>' +
      '<a id="invalidLink2" href="/otherlink"></a>' +
      '<h1 id="title">Title</h1>';
  });

  test('is a function exported by theme-a11y.js', () => {
    expect(typeof bindInPageLinks).toBe('function');
  });

  test('returns array of link elements that were binded', () => {
    const links = bindInPageLinks();

    expect(Array.isArray(links)).toBeTruthy;
    expect(links.length).toBe(1);
  });

  test("adds an event handler that focuses the element referred to in an <a> element w/ a href='#...' when it is clicked", () => {
    const link = document.getElementById('link');
    const title = document.getElementById('title');

    bindInPageLinks();

    link.click();

    expect(document.activeElement).toBe(title);
  });
});

import { Component, Event, EventEmitter, Listen, Method, State } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('event', () => {

  it('event normal ionChange event', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {

      @Event() ionChange: EventEmitter;

      @State() counter = 0;

      @Listen('ionChange')
      onIonChange() {
        this.counter++;
      }

      @Method()
      emitEvent() {
        this.ionChange.emit();
      }

      render() {
        return `${this.counter}`;
      }
    }

    const { root, flush } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a>0</cmp-a>
    `);

    root.emitEvent();
    await flush();

    expect(root).toEqualHtml(`
      <cmp-a>1</cmp-a>
    `);

    let called = false;
    root.addEventListener('ionChange', (ev: CustomEvent) => {
      expect(ev.bubbles).toBe(true);
      expect(ev.cancelable).toBe(true);
      expect(ev.composed).toBe(true);
      called = true;
    });

    root.emitEvent();
    await flush();

    expect(called).toBe(true);
    expect(root).toEqualHtml(`
      <cmp-a>2</cmp-a>
    `);
  });

  it('should have custom name', async () => {
    @Component({ tag: 'cmp-b'})
    class CmpB {

      @Event({eventName: 'ionStyle'}) style: EventEmitter;
      @State() counter = 0;

      @Listen('ionStyle')
      onIonStyle() {
        this.counter++;
      }

      @Method()
      emitEvent() {
        this.style.emit();
      }

      render() {
        return `${this.counter}`;
      }
    }

    const { root, flush } = await newSpecPage({
      components: [CmpB],
      html: `<cmp-b></cmp-b>`,
    });

    expect(root).toEqualHtml(`
      <cmp-b>0</cmp-b>
    `);

    let called = false;
    root.addEventListener('ionStyle', (ev: CustomEvent) => {
      expect(ev.bubbles).toBe(true);
      expect(ev.cancelable).toBe(true);
      expect(ev.composed).toBe(true);
      called = true;
    });
    root.emitEvent();
    await flush();

    expect(called).toBe(true);
    expect(root).toEqualHtml(`
      <cmp-b>1</cmp-b>
    `);
  });

  it('should have different default settings', async () => {
    @Component({ tag: 'cmp-c'})
    class CmpC {

      @Event({
        eventName: 'ionStyle',
        bubbles: false,
        composed: false,
        cancelable: false,
      }) style: EventEmitter;

      @State() counter = 0;

      @Listen('ionStyle')
      onIonStyle() {
        this.counter++;
      }

      @Method()
      emitEvent() {
        this.style.emit();
      }

      render() {
        return `${this.counter}`;
      }
    }

    const { root, flush } = await newSpecPage({
      components: [CmpC],
      html: `<cmp-c></cmp-c>`,
    });

    expect(root).toEqualHtml(`
      <cmp-c>0</cmp-c>
    `);

    let called = false;
    root.addEventListener('ionStyle', (ev: CustomEvent) => {
      expect(ev.bubbles).toBe(false);
      expect(ev.cancelable).toBe(false);
      expect(ev.composed).toBe(false);
      called = true;
    });
    root.emitEvent();
    await flush();

    expect(called).toBe(true);

    expect(root).toEqualHtml(`
      <cmp-c>1</cmp-c>
    `);
  });
});

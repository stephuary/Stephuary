/**
 * Report page UI shell — native custom elements (no Shadow DOM) so existing
 * document queries (#report-pattern-head, #rpt-nest-root, [data-rpt-item], …)
 * keep working. Maps to: HeroSection, StartHereBlock, AccordionGroup,
 * AccordionItem (diagnostic rows), ImpactBlock, FinalCTA.
 */
(function () {
  function define(name, Class) {
    if (customElements.get(name)) return;
    customElements.define(name, Class);
  }

  define(
    'report-hero-section',
    class ReportHeroSection extends HTMLElement {
      connectedCallback() {
        this.setAttribute('role', 'banner');
      }
    }
  );

  define(
    'report-start-here-block',
    class ReportStartHereBlock extends HTMLElement {
      connectedCallback() {
        this.setAttribute('role', 'region');
        this.setAttribute('aria-label', 'Start here');
      }
    }
  );

  define(
    'report-accordion-group',
    class ReportAccordionGroup extends HTMLElement {
      connectedCallback() {
        var label = this.getAttribute('group-label');
        if (!label) return;
        if (this.querySelector('.rpt-nest-group__label')) return;
        var p = document.createElement('p');
        p.className = 'rpt-nest-group__label';
        p.textContent = label;
        this.insertBefore(p, this.firstChild);
      }
    }
  );

  define(
    'report-accordion-item',
    class ReportAccordionItem extends HTMLElement {
      connectedCallback() {
        /* Class report-acc-item carries layout; no shadow — panels stay queryable. */
      }
    }
  );

  define(
    'report-impact-block',
    class ReportImpactBlock extends HTMLElement {
      connectedCallback() {
        this.setAttribute('role', 'note');
      }
    }
  );

  define(
    'report-final-cta',
    class ReportFinalCta extends HTMLElement {
      connectedCallback() {
        this.setAttribute('role', 'region');
        this.setAttribute('aria-label', 'Next step');
      }
    }
  );
})();

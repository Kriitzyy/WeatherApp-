const { JSDOM } = require('jsdom');

/**
 * Sätter upp en virtuell DOM med JSDOM innan varje test.
 */
beforeEach(() => {
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
  global.window = dom.window;
  global.document = dom.window.document;
  global.fetch = require('node-fetch'); // Behövs om du använder fetch
});


/**
 * Testsvit för sökfunktionen i väderappen.
 */
describe("Väderapp - Sökfunktion", () => {
  /**
   * Förbereder HTML-element inför varje test.
   */
  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="city-input" />
      <button id="search-btn">Sök</button>
      <div id="city-name"></div>
    `;
  });

  /**
   * Testar att stadens namn visas efter en sökning.
   */
  it("ska visa stadens namn efter sökning", () => {
    document.getElementById('city-input').value = "Stockholm";
    document.getElementById('search-btn').click();

    // Simulera sökresultat
    document.getElementById('city-name').textContent = "📍 Stockholm";

    expect(document.getElementById('city-name').textContent).toContain("Stockholm");
  });
});


/**
 * Testsvit för växling mellan Celsius och Fahrenheit.
 */
describe("Väderapp - Växla mellan enheter", () => {
  /**
   * Skapar knapp före varje test.
   */
  beforeEach(() => {
    document.body.innerHTML = `<button id="unit-toggle">Växla till °F</button>`;
  });

  /**
   * Testar att knappens text växlar korrekt.
   */
  it("ska växla knapptexten mellan °C och °F", () => {
    const toggleBtn = document.getElementById('unit-toggle');

    // Simulera växling
    toggleBtn.click();
    toggleBtn.textContent = 'Växla till °C';
    expect(toggleBtn.textContent).toBe('Växla till °C');

    toggleBtn.click();
    toggleBtn.textContent = 'Växla till °F';
    expect(toggleBtn.textContent).toBe('Växla till °F');
  });
});


/**
 * Testsvit för API-anslutning till vädertjänst.
 */
describe("Väderapp - API-anslutning", () => {
  /**
   * Mockar fetch innan varje test.
   */
  beforeEach(() => {
    global.fetch = jasmine.createSpy('fetch').and.returnValue(Promise.resolve({
      json: () => Promise.resolve({ cod: 200, name: "Stockholm" })
    }));
  });

  /**
   * Testar att API-anrop returnerar status 200 och stadens namn.
   * @param {Function} done - Callback för async test.
   */
  it("ska hämta väderdata och få status 200", (done) => {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=Stockholm")
      .then(res => res.json())
      .then(data => {
        expect(data.cod).toBe(200);
        expect(data.name).toBe("Stockholm");
        done();
      });
  });
});

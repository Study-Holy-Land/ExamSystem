package homepage;

import org.junit.After;
import selenium.Browser;

public abstract class TwarsFixture {

    protected Browser browser;

    public TwarsFixture() {
        browser = new Browser();
    }

    @After
    public void tearDown() throws Exception {
        browser.close();
    }
}

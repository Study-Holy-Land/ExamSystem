package selenium;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.events.EventFiringWebDriver;

public class Browser {
    private WebDriver driver;

    public void close() {
        if(driver != null) {
            driver.quit();
            driver = null;
        }
    }

    public WebDriver getDriver() {
        if(null == driver) {
            driver = new ChromeDriver();
            EventFiringWebDriver efwd = new EventFiringWebDriver(driver);
            efwd.register(new SeleniumEventLogger());
            driver = efwd;
        }
        return driver;
    }
}

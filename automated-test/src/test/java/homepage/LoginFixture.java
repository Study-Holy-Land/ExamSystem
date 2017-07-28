package homepage;

import org.concordion.integration.junit4.ConcordionRunner;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import selenium.SeleniumScreenshotTaker;

@RunWith(ConcordionRunner.class)

public class LoginFixture extends TwarsFixture {

    private SeleniumScreenshotTaker screenshotTaker = new SeleniumScreenshotTaker(browser);

//    @Extension
//    public ConcordionExtension extension = new ScreenshotExtension().setScreenshotTaker(screenshotTaker);

    public Boolean login(String account, String password) {

        WebDriver driver = browser.getDriver();

        driver.get("http://192.168.99.100:8888/register.html#login");
        driver.manage().window().setSize(new Dimension(1024, 768));

        (new WebDriverWait(driver, 10))
                .until(ExpectedConditions.presenceOfElementLocated(By.name
                        ("email")));

        WebElement emailInput = driver.findElement(By.name("email"));
        WebElement captcha = driver.findElement(By.name("captcha"));
        WebElement passwordInput = driver.findElement(By.name("loginPassword"));

        WebElement loginBtn = driver.findElement(By.id("login-btn"));

        emailInput.sendKeys(account);
        captcha.sendKeys("1234");
        passwordInput.sendKeys(password);

        loginBtn.click();

        WebElement dropdownMenu = (new WebDriverWait(driver, 10))
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[@id='dropdownMenu1']/span[1]")));

        return dropdownMenu.getText().equals(account);

    }
}
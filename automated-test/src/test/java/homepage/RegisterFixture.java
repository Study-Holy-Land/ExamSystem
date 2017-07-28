package homepage;

import org.concordion.integration.junit4.ConcordionRunner;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

@RunWith(ConcordionRunner.class)
public class RegisterFixture {
    public Boolean register(String mobilePhone, String email, String password) {
        ChromeDriver driver = new ChromeDriver();

        driver.get("http://192.168.99.100:8888/register.html#register");

        (new WebDriverWait(driver, 10))
                .until(ExpectedConditions.presenceOfElementLocated(By.name
                        ("email")));

        WebElement mobilePhoneInput = driver.findElement(By.name("mobilePhone"));
        WebElement emailInput = driver.findElement(By.name("email"));
        WebElement passwordInput = driver.findElement(By.name("password"));
        WebElement captcha = driver.findElement(By.name("captcha"));
        WebElement degreeCheckbox = driver.findElement(By.className("agree-check"));
        WebElement registerBtn = driver.findElement(By.id("register-btn"));

        mobilePhoneInput.sendKeys(mobilePhone);
        emailInput.sendKeys(email);
        passwordInput.sendKeys(password);
        captcha.sendKeys("1234");
        degreeCheckbox.click();
        registerBtn.click();

        WebElement dropdownMenu = (new WebDriverWait(driver, 10))
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[@id='dropdownMenu1']/span[1]")));

        return dropdownMenu.getText().equals(email);
    }
}

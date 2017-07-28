package selenium;

import org.concordion.ext.ScreenshotTaker;
import org.concordion.ext.ScreenshotUnavailableException;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.events.EventFiringWebDriver;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;


public class SeleniumScreenshotTaker implements ScreenshotTaker {

    private final WebDriver driver;

    public SeleniumScreenshotTaker(Browser browser) {


        WebDriver baseDriver = browser.getDriver();

        while (baseDriver instanceof EventFiringWebDriver) {
            baseDriver = ((EventFiringWebDriver) baseDriver).getWrappedDriver();
        }

        this.driver = baseDriver;
    }

    @Override
    public Dimension writeScreenshotTo(OutputStream outputStream) throws IOException {
        byte[] screenShot;

        try {
            screenShot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
        } catch (ClassCastException e){
            throw new ScreenshotUnavailableException("driver does not implement TakesScreenshot");
        }

        outputStream.write(screenShot);

        return getImageDimension(screenShot);
    }

    private Dimension getImageDimension(byte[] screenShot) throws IOException {
        InputStream in = new ByteArrayInputStream(screenShot);
        BufferedImage buf = ImageIO.read(in);

        return new Dimension(buf.getWidth(), buf.getHeight());
    }

    @Override
    public String getFileExtension() {
        return "png";
    }
}

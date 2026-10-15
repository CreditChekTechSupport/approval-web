import { describe, expect, it } from "vitest";
import { buildWidgetUrl, CreditChekError } from "../src";

const PUBLIC_KEY = "vy6LZWI/l/pOc868+z8LAg==";
const WIDGET_ID = "widget-1";

describe("buildWidgetUrl", () => {
  it("builds the production URL with the required params", () => {
    const url = new URL(buildWidgetUrl({ publicKey: PUBLIC_KEY, widgetId: WIDGET_ID }, "session-1"));
    expect(url.origin).toBe("https://securedwidget.creditchek.africa");
    expect(url.searchParams.get("publicKey")).toBe(PUBLIC_KEY);
    expect(url.searchParams.get("sessionId")).toBe("session-1");
    expect(url.searchParams.get("widgetId")).toBe(WIDGET_ID);
    expect(url.searchParams.get("source")).toBe("react");
    expect(url.searchParams.get("hostOrigin")).toBe(window.location.origin);
  });

  it("URL-encodes the public key", () => {
    const raw = buildWidgetUrl({ publicKey: PUBLIC_KEY, widgetId: WIDGET_ID }, "s");
    expect(raw).toContain("publicKey=vy6LZWI%2Fl%2FpOc868%2Bz8LAg%3D%3D");
  });

  it("passes prefill values", () => {
    const url = new URL(
      buildWidgetUrl(
        {
          publicKey: PUBLIC_KEY,
          widgetId: WIDGET_ID,
          prefill: { firstName: " Ada ", lastName: "", dob: "1990-01-31", nin: "12345678901" },
        },
        "s",
      ),
    );
    expect(url.searchParams.get("firstName")).toBe("Ada");
    expect(url.searchParams.has("lastName")).toBe(false);
    expect(url.searchParams.get("dob")).toBe("1990-01-31");
    expect(url.searchParams.get("nin")).toBe("12345678901");
  });

  it("ignores options the SDK does not support", () => {
    const config = {
      publicKey: PUBLIC_KEY,
      widgetId: WIDGET_ID,
      prefill: { firstName: "Ada", phone: "0800" },
      themeColor: "#0046E6",
      modules: ["identity", "liveness"],
      environment: "development",
      incomeForm: "long",
    } as never;
    const url = new URL(buildWidgetUrl(config, "s"));
    expect(url.searchParams.has("phone")).toBe(false);
    expect(url.searchParams.has("themeColor")).toBe(false);
    expect(url.searchParams.has("module")).toBe(false);
    expect(url.searchParams.has("environment")).toBe(false);
    expect(url.searchParams.has("incomeForm")).toBe(false);
  });

  it("honours a custom widgetUrl", () => {
    const url = new URL(
      buildWidgetUrl({ publicKey: PUBLIC_KEY, widgetId: WIDGET_ID, widgetUrl: "http://localhost:5173/" }, "s"),
    );
    expect(url.origin).toBe("http://localhost:5173");
  });

  it.each([
    [{ publicKey: "", widgetId: WIDGET_ID }, "s"],
    [{ publicKey: PUBLIC_KEY, widgetId: "" }, "s"],
    [{ publicKey: PUBLIC_KEY } as never, "s"],
    [{ publicKey: PUBLIC_KEY, widgetId: WIDGET_ID }, ""],
    [{ publicKey: PUBLIC_KEY, widgetId: WIDGET_ID, widgetUrl: "not a url" }, "s"],
  ])("rejects invalid config %#", (config, sessionId) => {
    expect(() => buildWidgetUrl(config, sessionId)).toThrow(CreditChekError);
  });
});

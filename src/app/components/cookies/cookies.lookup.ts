import { NgcCookieConsentConfig } from "ngx-cookieconsent";
import { environment } from "src/environments/environment";

export const COOKIES_CONFIG: NgcCookieConsentConfig = {
  enabled: true,
  cookie: {
    domain: environment.domain,
  },
  position: "bottom-right",
  theme: "block",
  autoOpen: false,
  palette: {
    popup: {
      background: "#fff",
      text: "#222",
      link: "#222",
    },
    button: {
      background: "#f1d600",
      text: "#000000",
      border: "transparent",
    },
  },
  type: "opt-in",
  content: {
    message: "",
    cookiePolicyLink: "Cookie Policy",
    cookiePolicyHref: "https://cookie.com",
    privacyPolicyLink: "Privacy Policy",
    privacyPolicyHref: "https://privacy.com",
    tosLink: "Terms of Service",
    tosHref: "https://tos.com",
    allow: "Allow",
    deny: "Deny",
  },
  layout: "my-custom-layout",
  layouts: {
    "my-custom-layout":
      '<div class="cookie-modal">{{custom-modal}}{{compliance}}</div>',
  },
  elements: {},
};

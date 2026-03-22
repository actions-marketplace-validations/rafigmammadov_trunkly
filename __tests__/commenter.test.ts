import { buildComment } from "../src/commenter";

describe("buildComment", () => {
  it("interpolates all standard variables", () => {
    const template =
      "Hey @{author}, tagged with `{label}`. Back at {end}, off at {start} ({timezone}).";
    const result = buildComment(template, {
      author: "octocat",
      label: "off-hours 🌙",
      start: "18:00",
      end: "09:00",
      timezone: "America/New_York",
    });
    expect(result).toBe(
      "Hey @octocat, tagged with `off-hours 🌙`. Back at 09:00, off at 18:00 (America/New_York)."
    );
  });

  it("leaves unknown placeholders untouched", () => {
    const template = "Hello {unknown}!";
    const result = buildComment(template, { author: "alice" });
    expect(result).toBe("Hello {unknown}!");
  });

  it("replaces all occurrences of the same variable", () => {
    const template = "{author} opened this. Thanks, {author}!";
    const result = buildComment(template, { author: "bob" });
    expect(result).toBe("bob opened this. Thanks, bob!");
  });

  it("falls back to default comment if template is empty", () => {
    const result = buildComment("", { author: "charlie" });
    expect(result).toContain("charlie");
    expect(result).toContain("🐘");
  });

  it("handles multiline templates", () => {
    const template = "Line 1: {author}\nLine 2: {label}";
    const result = buildComment(template, {
      author: "dave",
      label: "off-hours",
    });
    expect(result).toBe("Line 1: dave\nLine 2: off-hours");
  });

  it("interpolates type and number variables", () => {
    const template = "This {type} #{number} will be reviewed later.";
    const result = buildComment(template, { type: "issue", number: "42" });
    expect(result).toBe("This issue #42 will be reviewed later.");
  });

  it("interpolates title variable", () => {
    const template = "Re: {title}";
    const result = buildComment(template, { title: "Bug: something broken" });
    expect(result).toBe("Re: Bug: something broken");
  });
});
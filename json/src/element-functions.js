export function  getTemplateContent(htmlText) {
    const template = document.createElement('template');
    template.innerHTML = htmlText;
    return template.content.cloneNode(true);
}

export function getStyleNode(styleText) {
    const style = document.createElement("style")
    style.innerHTML = styleText
    return style
}

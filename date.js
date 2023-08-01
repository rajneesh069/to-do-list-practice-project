const date = new Date();

exports.getDate = () => {
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    const locale = "en-US";
    const today = date.toLocaleDateString(locale, options);
    return today;
}
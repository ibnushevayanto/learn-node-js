module.exports = (req) => {
  return req
    .get("Cookie")
    .split(";")
    .map((res) => {
      const itemcookie = res.split("=");
      return {
        value: itemcookie[1],
        key: itemcookie[0],
      };
    });
};

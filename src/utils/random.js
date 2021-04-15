
const flipCoin = () => {
    return Math.floor(Math.random() * 2);
};

const between = (min, max) => {
    return Math.floor((Math.random() * (max - min) + min));
};

const random = {
    flipCoin,
    between
}
export default random;

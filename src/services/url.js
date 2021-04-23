export const getUrl = () => {
    if (process.env.ENV == "heroku") {
        return "https://server-jogo-da-velha.herokuapp.com/";
    }
    return "localhost:4000"
}
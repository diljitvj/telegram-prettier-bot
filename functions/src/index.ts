import * as functions from "firebase-functions";
import * as p from "prettier";
import { get } from "https";
import { telegramToken } from "./config.json";

export const helloWorld = functions.https.onRequest(
  async (request, response) => {
    const {
      message: {
        chat: { id },
        text
      }
    } = request.body;
    let message;
    try {
      message = p
        .format(text, { parser: "babel" })
        .split("\n")
        .map(frag => "```js " + frag + " ```")
        .join("%0A");
    } catch (err) {
      console.log(JSON.stringify(err));
      message = err.message;
    }
    await get(
      `https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${id}&text=${message}&parse_mode=Markdown`
    );

    response.send(true);
  }
);

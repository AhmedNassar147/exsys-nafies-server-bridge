/*
 *
 * Helper: `getRemoteFilePathData`.
 *
 */
import axios from "axios";

const delayProcess = (fn, options, ms) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(fn(options));
    }, +ms)
  );

const getRemoteFilePathData = async (fileUrl, retryTimes = 0) =>
  await new Promise(async (resolve) => {
    const wrapper = (n) => {
      axios
        .get(fileUrl, {
          responseType: "arraybuffer",
          // responseEncoding: "binary",
        })
        .then(({ data }) => {
          resolve({
            data,
            notFound: !data,
            // sizeMb,
          });
        })
        .catch(async (error) => {
          const { response } = error || {};
          const { status } = response || {};

          if (n > 0 && typeof status === "undefined") {
            await delayProcess(1000);
            wrapper(--n);
          } else {
            resolve({
              notFound: [404, 500].includes(status),
              sizeMb: 0,
            });
          }
        });
    };

    wrapper(retryTimes);
  });

export default getRemoteFilePathData;

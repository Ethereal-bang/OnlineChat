/* eslint-disable no-restricted-globals */
//  根据分片的文件计算hash值
self.importScripts(process.env.PUBLIC_URL + "/js/spark-md5.min.js");

self.onmessage = e => {
    const { chunks } = e.data;
    const spark = new self.SparkMD5.ArrayBuffer();
    let cnt = 0;
    const loadNext = index => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(chunks[index]); // 读取Blob
        reader.onload = e => {
            cnt++;
            spark.append(e.target.result);
            if (cnt === chunks.length) {
                self.postMessage({
                    hash: spark.end()
                });
            } else {
                loadNext(cnt);
            }
        };
    }
    loadNext(0);
}
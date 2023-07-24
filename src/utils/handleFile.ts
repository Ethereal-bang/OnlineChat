// 文件切片处理
export const createFileChunks = (file: Blob, size: number): Blob[] => {
    const fileChunks: Blob[] = [];
    let cur = 0;
    while (cur < file.size) {
        fileChunks.push(file.slice(cur, cur + size));
        cur += size;
    }
    return fileChunks;
};

// 在web-worker线程计算切片文件hash
export const calculateChunksHash = (chunks: Blob[]): Promise<string> => {
    return new Promise(resolve => {
        const worker = new Worker(new URL("./hash.js", import.meta.url));
        worker.postMessage({chunks});
        worker.onmessage = (e) => {
            const {hash} = e.data;
            resolve(hash);
        };
    });
}
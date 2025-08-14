"use server"
export async function getResponse(message: string[]) {

  const data = JSON.stringify({ messages: message })
  console.log("*************data", data)
  const res = await fetch("http://127.0.0.1:8000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data ,
  });

  console.log("*************response", res)

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  return {
    async *[Symbol.asyncIterator]() {
      if (!reader) return;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value, { stream: true });
      }
    },
  };
}

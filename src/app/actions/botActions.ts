"use server"


const AGENT_URL = process.env.AGENT_URL || "";

export async function getResponse(message: string[]) {

  const data = JSON.stringify({ messages: message })
  const res = await fetch(AGENT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data ,
  });


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

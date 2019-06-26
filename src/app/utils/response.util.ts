export function getDataFrom(resp) {
  if (resp && resp.error) {
    throw resp.error;
  }

  if (!(resp && resp.data)) {
    throw new Error("No data found in response");
  }

  return resp.data;
}

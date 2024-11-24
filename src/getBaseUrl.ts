export const getBaseUrl = async (providerValue: string) => {
  try {
    let baseUrl = '';
    const baseUrlRes = await fetch(
      'https://himanshu8443.github.io/providers/modflix.json',
    );
    const baseUrlData = await baseUrlRes.json();
    baseUrl = baseUrlData[providerValue].url;
    return baseUrl;
  } catch (error) {
    console.error(`Error fetching baseUrl: ${providerValue}`, error);
    return '';
  }
};

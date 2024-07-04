document.addEventListener("DOMContentLoaded", async () => {
  const fetchData = async () => {
    try {
      const response = await fetch("/tickers");
      const tickers = await response.json();

      const tbody = document.getElementById("tickers");
      tbody.innerHTML = ""; // Clear existing data

      tickers.forEach((ticker, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${ticker.name}</td>
          <td>${ticker.last}</td>
          <td>${ticker.buy} / ${ticker.sell}</td>
          <td>${ticker.volume}</td>
          <td>${ticker.base_unit}</td>
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error fetching tickers:", error);
    }
  };

  // Initial fetch
  fetchData();

  // Fetch data every 60 seconds
  setInterval(fetchData, 60000);
});

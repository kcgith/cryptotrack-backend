This app is a backend service built with Node.js, Express, and MongoDB Atlas. Its primary purpose is to track cryptocurrency data (Bitcoin, Matic, and Ethereum) by fetching live stats every 2 hours and storing them in a database.

It provides two key features through RESTful APIs:

/stats Endpoint: Retrieves the latest price, market cap, and 24-hour change for a specific cryptocurrency.
/deviation Endpoint: Calculates the standard deviation of the last 100 price records for a given cryptocurrency, providing insights into price fluctuations.
The app uses a cron job to automate data fetching and ensures scalability for production by using PM2 for process management. It’s a data-focused service ready for integration with a frontend or analytics tools.


The service has been hosted onto an AWS EC2 instance : http://16.171.113.155:3000/. Please navigate to the required routes : /stats, /deviation with the query params for access.
eg : http://16.171.113.155:3000/stats?coin=ethereum | http://16.171.113.155:3000/deviation?coin=bitcoin

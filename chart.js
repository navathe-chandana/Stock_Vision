
// Function to create a dynamic chart with prediction data
function createPredictionChart(predictionData) {
    // Get the chart container
    const chartContainer = document.querySelector('.chart-container');
    
    // Clear any existing content
    chartContainer.innerHTML = '';
    
    if (!predictionData || predictionData.length === 0) {
        chartContainer.innerHTML = '<div class="chart-placeholder">No prediction data available</div>';
        return;
    }
    
    // Extract data for chart
    const dates = predictionData.map(item => item.Date);
    const prices = predictionData.map(item => parseFloat(item['Predicted Price']));
    
    // Find min and max for scaling
    const minPrice = Math.min(...prices) * 0.98; // Add some padding
    const maxPrice = Math.max(...prices) * 1.02;
    const priceRange = maxPrice - minPrice;
    
    // Create SVG element with viewBox for better scaling
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 1000 400');
    svg.setAttribute('preserveAspectRatio', 'none');
    
    // Create a group for the chart elements
    const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    chartGroup.setAttribute('transform', 'translate(50, 20)'); // Margin for axes
    svg.appendChild(chartGroup);
    
    // Create gradient definition
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'areaGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#3498db');
    stop1.setAttribute('stop-opacity', '0.7');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#3498db');
    stop2.setAttribute('stop-opacity', '0.1');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);
    
    // Chart dimensions
    const chartWidth = 900;
    const chartHeight = 350;
    
    // Create points for the path
    const pointDistance = chartWidth / (predictionData.length - 1);
    
    // Create paths
    let linePath = '';
    let areaPath = '';
    
    // Helper function to scale Y values
    function scaleY(price) {
        const percentage = (price - minPrice) / priceRange;
        // Invert the Y axis (SVG Y axis is inverted)
        return chartHeight - (percentage * chartHeight);
    }
    
    // Generate path data
    for (let i = 0; i < prices.length; i++) {
        const x = i * pointDistance;
        const y = scaleY(prices[i]);
        
        if (i === 0) {
            linePath = `M ${x},${y}`;
            areaPath = `M ${x},${y}`;
        } else {
            linePath += ` L ${x},${y}`;
            areaPath += ` L ${x},${y}`;
        }
        
        // Add point markers
        const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        point.setAttribute('cx', x);
        point.setAttribute('cy', y);
        point.setAttribute('r', 4);
        point.setAttribute('fill', '#3498db');
        chartGroup.appendChild(point);
        
        // Add hover effect for data points
        point.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            tooltip.setAttribute('x', x + 10);
            tooltip.setAttribute('y', y - 10);
            tooltip.setAttribute('fill', '#2c3e50');
            tooltip.setAttribute('font-size', '12px');
            tooltip.setAttribute('id', 'price-tooltip');
            tooltip.textContent = `${dates[i]}: $${prices[i].toFixed(2)}`;
            chartGroup.appendChild(tooltip);
            
            e.target.setAttribute('r', 6);
            e.target.setAttribute('fill', '#2c3e50');
        });
        
        point.addEventListener('mouseleave', (e) => {
            const tooltip = document.getElementById('price-tooltip');
            if (tooltip) {
                chartGroup.removeChild(tooltip);
            }
            e.target.setAttribute('r', 4);
            e.target.setAttribute('fill', '#3498db');
        });
    }
    
    // Complete the area path
    areaPath += ` L ${(prices.length - 1) * pointDistance},${chartHeight} L 0,${chartHeight} Z`;
    
    // Create the area path (add it first so it's behind the line)
    const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    area.setAttribute('d', areaPath);
    area.setAttribute('fill', 'url(#areaGradient)');
    area.setAttribute('stroke', 'none');
    chartGroup.appendChild(area);
    
    // Create the line path
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', linePath);
    line.setAttribute('stroke', '#3498db');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('fill', 'none');
    chartGroup.appendChild(line);
    
    // Draw X axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', 0);
    xAxis.setAttribute('y1', chartHeight);
    xAxis.setAttribute('x2', chartWidth);
    xAxis.setAttribute('y2', chartHeight);
    xAxis.setAttribute('stroke', '#95a5a6');
    xAxis.setAttribute('stroke-width', '1');
    chartGroup.appendChild(xAxis);
    
    // Draw Y axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', 0);
    yAxis.setAttribute('y1', 0);
    yAxis.setAttribute('x2', 0);
    yAxis.setAttribute('y2', chartHeight);
    yAxis.setAttribute('stroke', '#95a5a6');
    yAxis.setAttribute('stroke-width', '1');
    chartGroup.appendChild(yAxis);
    
    // Add Y-axis labels (price ranges)
    const yLabels = 5; // Number of labels
    for (let i = 0; i <= yLabels; i++) {
        const price = minPrice + (priceRange * i / yLabels);
        const y = scaleY(price);
        
        // Add horizontal grid line
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        gridLine.setAttribute('x1', 0);
        gridLine.setAttribute('y1', y);
        gridLine.setAttribute('x2', chartWidth);
        gridLine.setAttribute('y2', y);
        gridLine.setAttribute('stroke', '#ecf0f1');
        gridLine.setAttribute('stroke-width', '1');
        chartGroup.appendChild(gridLine);
        
        // Add price label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', -5);
        label.setAttribute('y', y + 4); // Adjust for text alignment
        label.setAttribute('text-anchor', 'end');
        label.setAttribute('font-size', '12px');
        label.setAttribute('fill', '#7f8c8d');
        label.textContent = '$' + price.toFixed(2);
        chartGroup.appendChild(label);
    }
    
    // Add X-axis labels (dates) - show only some to avoid crowding
    const dateStep = Math.max(1, Math.floor(predictionData.length / 6));
    for (let i = 0; i < predictionData.length; i += dateStep) {
        const x = i * pointDistance;
        const date = dates[i];
        
        // Add date label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x);
        label.setAttribute('y', chartHeight + 20);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '12px');
        label.setAttribute('fill', '#7f8c8d');
        label.textContent = date;
        chartGroup.appendChild(label);
    }
    
    // Add chart title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', chartWidth / 2);
    title.setAttribute('y', -5);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16px');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#2c3e50');
    title.textContent = 'Stock Price Prediction';
    chartGroup.appendChild(title);
    
    // Add SVG to container
    chartContainer.appendChild(svg);
}

// Function to get starting price based on ticker
function getStartPrice(ticker) {
    const prices = {
        'AAPL': 172.50,
        'MSFT': 315.75,
        'GOOGL': 142.30,
        'AMZN': 132.80,
        'META': 325.40,
        'TSLA': 215.65
    };
    return prices[ticker] || 100;
}

// Function to create the prediction table
function createPredictionTable(predictionData) {
    // Create table rows
    const tableBody = document.getElementById('predictionTableBody');
    tableBody.innerHTML = '';
    
    predictionData.forEach((prediction, i) => {
        const row = document.createElement('tr');
        if (prediction.isTargetDate) {
            row.classList.add('highlighted');
        }
        
        // Add date cell
        const dateCell = document.createElement('td');
        dateCell.textContent = prediction.Date;
        row.appendChild(dateCell);
        
        // Add price cell
        const priceCell = document.createElement('td');
        priceCell.textContent = '$' + prediction['Predicted Price'].toFixed(2);
        row.appendChild(priceCell);
        
        // Add change cell with trend indicator
        const changeCell = document.createElement('td');
        const prevPrice = i > 0 ? predictionData[i-1]['Predicted Price'] : prediction['Predicted Price'];
        const change = prediction['Predicted Price'] - prevPrice;
        const changePercent = (change / prevPrice * 100).toFixed(2);
        
        const trend = document.createElement('span');
        trend.classList.add('trend-indicator');
        
        if (change >= 0) {
            trend.classList.add('up');
            trend.textContent = '▲ ' + changePercent + '%';
        } else {
            trend.classList.add('down');
            trend.textContent = '▼ ' + Math.abs(changePercent) + '%';
        }
        
        changeCell.appendChild(trend);
        row.appendChild(changeCell);
        tableBody.appendChild(row);
    });
}



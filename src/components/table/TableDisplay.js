import React, { Component } from 'react';

class TableDisplay extends Component {
  renderTableDataRow(headerRow, tData) {
    let i = 0, tdRow = [];

    for (i; headerRow.length > i; i++) {
      tdRow.push(<td key={i}>{tData[headerRow[i]]}</td>);
    }

    return <tr>{tdRow}</tr>;
  }

  render() {
    const headerRow = this.props.tableData.length > 0 ? Object.keys(this.props.tableData[0]) : [];
    return (
      <table>
        <tbody>
          <tr>
            {headerRow.map(header => {
              return <th key={header}style={{padding: '0 10px'}}>{header}</th>;
            })}
          </tr>
          {this.props.tableData.map(tData => {
            return this.renderTableDataRow(headerRow, tData);
          })}
        </tbody>
      </table>
    );
  }
}

export default TableDisplay;
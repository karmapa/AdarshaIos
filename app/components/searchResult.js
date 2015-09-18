
import React, { Component, PropTypes, View, Text, ScrollView } from 'react-native';

import { styles } from './searchResult.style';

class SearchResult extends Component {

  static defaultProps = {
    excerpts: []
  };

  renderItem(item) {
    return <Text style={styles.text} children={this.highlight(item.text, item.realHits)} />;
  }

  render() {
    let {excerpts} = this.props;
    return <ScrollView height={436} style={styles.searchResult}>{excerpts.map(this.renderItem.bind(this))}</ScrollView>;
  }

  highlight(text, hits) {
    let ex = 0;
    let out = [];

    for (let i = 0; i < hits.length; i++) {
      let now = hits[i][0];
      if (now > ex) {
        out.push(<Text key={ex}>{text.substring(ex, now)}</Text>);
      }
      out.push(<Text key={'h'+ex} style={styles.highlight}>{text.substr(now, hits[i][1])}</Text>);
      ex = now += hits[i][1];
    }
    out.push(<Text key={ex}>{text.substr(ex)}</Text>);

    return out;
  }
}

export default SearchResult;

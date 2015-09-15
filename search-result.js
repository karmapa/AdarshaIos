
var React = require("react-native");

var {StyleSheet, Text, ScrollView} = React;

var styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 5,
    padding: 30
  },
  text: {
    backgroundColor:'#FFFFFF',
    color: '#656565',
    fontSize: 20,
    margin: 5
  },
  flowRight: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row'
  },
  highlight: {
    color:"#FF7F7F"
  }
});

var highlight = function(text, hits) {
  var ex = 0;
  var out = [];

  for (var i = 0; i < hits.length; i++) {
    var now = hits[i][0];
    if (now > ex) {
      out.push(<Text key={ex}>{text.substring(ex,now)}</Text>);
    }
    out.push(<Text key={'h'+ex} style={styles.highlight}>{text.substr(now,hits[i][1])}</Text>);
    ex = now += hits[i][1];
  }
  out.push(<Text key={ex}>{text.substr(ex)}</Text>);

  return out;
};

var SearchResult = React.createClass({
  getDefaultProps: function() {
    return {
      excerpts: []
    };
  },
  renderItem: function(item) {
    return <Text style={styles.text} children={highlight(item.text, item.realHits)} />
  },
  render:function() {
    return <ScrollView height={850}>{this.props.excerpts.map(this.renderItem)}</ScrollView>
  }
});

module.exports = SearchResult;

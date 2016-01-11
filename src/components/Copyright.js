import React, {Component, View} from 'react-native';
import {TibetanText} from '.';
import {styles} from './Copyright.style';

class Biography extends Component {

  render() {

    return (
      <View style={styles.container}>
        <TibetanText style={styles.title}>Copyright and Disclaimer</TibetanText>
        <TibetanText>All rights reserved. No part of this publication may be reproduced, distributed,
          or transmitted in any form or by any means, including photocopying, recording,
          or other electronic or mechanical methods, without the prior written permission of the publisher,
         except in the case of brief quotations embodied in critical reviews and certain other noncommercial
         uses permitted by copyright law. For permission requests, write to the publisher,
         addressed “Attention: Permissions Coordinator,” at the address belowཨཱཪྱ á、è、î、õ 和 ü.aeiou </TibetanText>
      </View>
    );
  }
}

export default Biography;

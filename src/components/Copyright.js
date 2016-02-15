import React, {Component, View, ScrollView, LinkingIOS} from 'react-native';
import {Background, TibetanText} from '.';
import {styles} from './Copyright.style';

const sourceCodeLink = 'https://github.com/karmapa/AdarshaIos';

class Biography extends Component {

  render() {

    return (
      <View style={styles.backgroundImageContainer}>
        <Background backgroundIndex={1}/>
        <ScrollView automaticallyAdjustContentInsets={false}>
          <View style={styles.container}>

            <TibetanText style={[styles.title, styles.center]}>ADARSHA</TibetanText>
            <TibetanText style={styles.center}>Reflecting Ancient Texts in New Ways</TibetanText>

            <TibetanText style={styles.center}>- Brief Introduction -</TibetanText>

            <TibetanText style={styles.p}>1. ADARSHA is an app that lets you read and conduct searches of ancient documents in a digital format. There are three main categories of texts: (a) Kangyur (the words of the Buddha translated into Tibetan); (b) Tengyur (commentaries by Indian scholars translated into Tibetan); and (c) Tibetan Buddhist scriptures.</TibetanText>

            <TibetanText style={styles.p}>2. The software features a fast search engine and simple user interface that meets the needs and habits of the common user in searching and reading material. Searches can be made in Unicode Tibetan or Wylie, and there are summaries of the scriptures for the convenience of the academic community.</TibetanText>

            <TibetanText style={styles.p}>3. His Holiness the 17th Karmapa Orgyen Trinley Dorje named the software ADARSHA (Sanskrit), which means “clear mirror,” with the hope that users will be able to clearly see their own minds reflected in the scriptures as if they were looking at a clear reflection in  a mirror.</TibetanText>

            <TibetanText style={styles.center}>- Features -</TibetanText>

            <TibetanText style={styles.p}>1. Search: ADARSHA allows fast searches of all texts as well as by title or other cataloging information, and allows filtering of results. Readers can also view texts according to the catalog, organized by pitaka and title of the text.</TibetanText>

            <TibetanText style={styles.p}>2. View texts: The reading display presents a simple view of the text with the ability to adjust text size and spacing as well as to view it in Wylie.</TibetanText>


            <TibetanText style={styles.center}>Development Team</TibetanText>
            <TibetanText style={styles.center}>Published under the editorial guidance of</TibetanText>
            <TibetanText style={styles.center}>the 17th Gyalwang Karmapa Ogyen Trinley Dorje</TibetanText>
            <TibetanText style={styles.center}>Dharma Treasure Corp.</TibetanText>
            <TibetanText style={styles.center}>contact us: dharma.treasure.corp@gmail.com</TibetanText>
            <TibetanText style={styles.center}>http://adarsha.dharma-treasure.org</TibetanText>

            <TibetanText style={styles.center}>Copyright (C) 2016</TibetanText>

            <TibetanText onPress={() => LinkingIOS.openURL(sourceCodeLink)} style={styles.link}>{sourceCodeLink}</TibetanText>


            <TibetanText style={[styles.center, {marginTop: 120, fontSize: 16}]}>ADARSHA 簡介</TibetanText>
            <TibetanText style={[styles.center, {fontSize: 16}]}>《 遠古經典，全新風貌 》</TibetanText>

            <TibetanText style={[styles.center, styles.heading]}>【 簡介 】</TibetanText>
            <TibetanText>1. 藏文古籍文獻數位搜尋、閱讀軟體。收錄三大數位內容：a. 甘珠爾（佛語）b. 丹珠爾（論典）c. 藏傳佛典</TibetanText>
            <TibetanText>2.搜尋引擎快速，使用介面簡潔。滿足一般大眾行動化搜尋、閱覽習慣，更提供wylie轉換、wildcards(萬用字符)搜尋等工具與經典提要等資訊，方便學術界研究使用。</TibetanText>
            <TibetanText>3.第十七世法王噶瑪巴鄔金欽列多傑賜名ADARSHA（梵文），意為「明鏡」，以期讀者閱覽經文，如照明鏡，返觀自心，明心見性。</TibetanText>

            <TibetanText style={[styles.center, styles.heading]}>【 功能 】</TibetanText>

            <TibetanText>1. 搜尋：提供樹狀目錄點選，亦可輸入經名、目錄、全文及進階搜尋。</TibetanText>
            <TibetanText>2. 閱讀：簡潔之閱讀版面，可自行調整字體大小、行距等。</TibetanText>

            <TibetanText style={[styles.center, styles.heading]}>【 開發團隊 】</TibetanText>
            <TibetanText style={styles.center}>總指導：尊貴的  第十七世大寶法王鄔金欽列多傑</TibetanText>
            <TibetanText style={styles.center}>製作單位：正法寶藏股份有限公司</TibetanText>

            <TibetanText style={[styles.center, {marginTop: 14}]}>The Dharma Treasure Corp.</TibetanText>
            <TibetanText style={styles.center}>contact us: dharma.treasure.corp@gmail.com</TibetanText>
            <TibetanText style={styles.center}>http://adarsha.dharma-treasure.org</TibetanText>

            <TibetanText style={styles.center}>Copyright (C) 2016</TibetanText>

            <TibetanText onPress={() => LinkingIOS.openURL(sourceCodeLink)} style={styles.link}>{sourceCodeLink}</TibetanText>

          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Biography;

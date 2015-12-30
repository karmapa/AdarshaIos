# ADARSHA iOS
It has a search engine with an intuitive front-end that facilitates searching and browsering of the processed Tabetan texts

![evernote camera roll 20151215 212838](https://cloud.githubusercontent.com/assets/880569/11811953/a8713b84-a373-11e5-9830-f1debd44a7bd.png)


## Setup

Tested on xcode Version 6.4 (6E35b)


```
# Do this for the first time only
npm run init
cd node_modules/react-native && npm install    // if you're using npm 3+ https://github.com/facebook/react-native/issues/1758#issuecomment-116252148
```

Add jiangkangur.kdb file to project in xcode
![xcode-add-files](https://raw.githubusercontent.com/kmsheng/AdarshaIos/master/docs/xcode-add-files.png)

Make sure to check Adarsha as target, this is very important.
![xcode-add-target](https://cloud.githubusercontent.com/assets/880569/12003325/86eaacaa-ab54-11e5-8e98-00904641e117.jpg)

# Do this before deploying to iphone

```
npm install -g react-native-cli    # if you don't have react-native command
react-native bundle --minify
```

# Terminology

* སྡེ་ཚན། 部 division
* མདོ་མིང་།   經名  tname
* མདོ་མིང་གཞན།  別名  aname
* རྒྱ་གར་མདོ་མིང་།梵文經名  sname
* རྒྱ་ནག་མདོ་མིང་།中文經名 cname
* བརྗོད་བྱ།  主題  subject
* ཐེག་པ། 乘法  yana
* དཀའ། འཁོར་ལོ། 哪一轉法輪  chakra
* གནས་ཕུན་སུམ་ཚོགས་པ།說法處  location
* ཆོས་ཀྱི་དགོས་དོན།法教目的  purpose
* བསྡུས་པའི་དོན། ལེའུ།大意與章數  collect
* མཚམས་སྦྱར་བའི་གོ་རིམ།關連性  relation
* རྒལ་ལན།  爭議  debate
* ལོ་ཙཱ་བ།  譯師  translator
* ཞུ་དག་པ།   校對者  revisor

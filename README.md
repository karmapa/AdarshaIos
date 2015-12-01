# ADARSHA iOS
It has a search engine with an intuitive front-end that facilitates searching and browsering of the processed Tabetan texts

## Setup

Tested on xcode Version 6.4 (6E35b)


```
# Do this for the first time only
npm run init
```
Add node_modules/kfs_* and kdb file to project

![xcode-add-files](https://raw.githubusercontent.com/kmsheng/AdarshaIos/master/docs/xcode-add-files.png)

Add assets/images/* to image.xcassets ( xcode )

See [adding static resources to your ios app using images xcassets](https://facebook.github.io/react-native/docs/image.html#adding-static-resources-to-your-ios-app-using-images-xcassets)

# Do this before deploying to iphone

```
react-native bundle --minify
```

# Terminology

* སྡེ་ཚན། 部 <division>
* མདོ་མིང་།   經名  <tname>
* མདོ་མིང་གཞན།  別名  <aname>
* རྒྱ་གར་མདོ་མིང་།梵文經名  <sname>
* རྒྱ་ནག་མདོ་མིང་།中文經名 <cname>
* བརྗོད་བྱ།  主題  <subject>
* ཐེག་པ། 乘法  <yana>
* དཀའ། འཁོར་ལོ། 哪一轉法輪  <chakra>
* གནས་ཕུན་སུམ་ཚོགས་པ།說法處  <location>
* ཆོས་ཀྱི་དགོས་དོན།法教目的  <purpose>
* བསྡུས་པའི་དོན། ལེའུ།大意與章數  <collect>
* མཚམས་སྦྱར་བའི་གོ་རིམ།關連性  <relation>
* རྒལ་ལན།  爭議  <debate>
* ལོ་ཙཱ་བ།  譯師  <translator>
* ཞུ་དག་པ།   校對者  <reviser>

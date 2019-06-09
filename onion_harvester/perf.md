# Performance

* base test command
  * ./mkp224o aaaaaaaaaa -s
* batch test command
  * ./mkp224o aaaaaaaaaa -s -B
* dell xps 15
  * no build args
    * no run args
      * 1,110,152
    * -B
      * 16,803,801
  * ./configure --enable-amd64-64-24k --enable-intfilter
    * no run args
      * 1,191,264
    * -B
      * 19,000,532
  * ./configure --enable-amd64-51-30k --enable-intfilter
    * no run args
      * 1,084,876
    * -B
      * 16,298,817
* 4 core azure vm
  * ./configure --enable-amd64-51-30k --enable-intfilter
    * -B arg
      * 18,771,017
  * ./configure --enable-amd64-64-24k --enable-intfilter
    * -B arg
      * 21,907,677

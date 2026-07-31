---
hide:
  - navigation
---
# R3SPOND Incident Response Framework

{{ translate('index.description') }}



## R3SPOND Matrix
<p>
<!DOCTYPE html>
<html lang="de">
    <head>
        {{ export_js_translations() }}
        <script type="text/javascript">
            window.custom_build = "{{extra.custom_build}}"
        </script>
        <style>:root{--md-text-font:"Roboto";--md-code-font:"Roboto Mono"}</style>
      <script>__md_scope=new URL(".",location),__md_hash=e=>[...e].reduce(((e,_)=>(e<<5)-e+_.charCodeAt(0)),0),__md_get=(e,_=localStorage,t=__md_scope)=>JSON.parse(_.getItem(t.pathname+"."+e)),__md_set=(e,_,t=localStorage,a=__md_scope)=>{try{t.setItem(a.pathname+"."+e,JSON.stringify(_))}catch(e){}}</script>
    </head>
    <body dir="ltr" data-md-color-scheme="r3spond_light" data-md-color-primary="indigo" data-md-color-accent="indigo">
        <input class="md-toggle" data-md-toggle="drawer" type="checkbox" id="__drawer" autocomplete="off">
        <input class="md-toggle" data-md-toggle="search" type="checkbox" id="__search" autocomplete="off">
        <label class="md-overlay" for="__drawer"></label>
        <div data-md-component="skip">
            <a href="#r3spond-a-generic-incident-response-framework" class="md-skip">Skip to content</a>
        </div>
        <div data-md-component="announce">
        </div>
        <div class="md-container" data-md-component="container">
            <!-- Main Components -->
            <main class="md-main" data-md-component="main">
                <div class="md-main__inner md-grid">
                    <div class="md-content" data-md-component="content">
                        <div class="matrix-container">
                        </div>
                    </div>
                    <script>
                        var tabs=__md_get("__tabs");if(Array.isArray(tabs))e:for(var set of document.querySelectorAll(".tabbed-set")){var labels=set.querySelector(".tabbed-labels");for(var tab of tabs)for(var label of labels.getElementsByTagName("label"))if(label.innerText.trim()===tab){var input=document.getElementById(label.htmlFor);input.checked=!0;continue e}}
                    </script>
                    <script>
                        var target=document.getElementById(location.hash.slice(1));target&&target.name&&(target.checked=target.name.startsWith("__tabbed_"))
                    </script>
                </div>
            </main>
        </div>
        <div class="md-dialog" data-md-component="dialog">
            <div class="md-dialog__inner md-typeset"></div>
        </div>
        <script type="text/javascript">
            const phases = {{ load_data('phases') }}
            const steps = {{ load_data('steps') }}
            const substeps = {{ load_data('substeps') }}

            document.addEventListener("DOMContentLoaded", function() {
                bootstrapMatrix(phases, steps, substeps)
            })
        </script>
</body>
</html>
</p>

## R3SPOND Prozess

<figure markdown="span">
  <img src="{{ translate('index.flowchart') }}" usemap="#map_flowchart">
  <figcaption></figcaption>
</figure>

<map name="map_flowchart">
  <area shape="rect" coords="20,30,2230,100" alt="R3SPOND Incident Response Framework" href="index.html">
  <area shape="rect" coords="98,780,258,860" alt="RP000" href="pages/response_phases/rp000.html">
  <area shape="rect" coords="578,460,738,540" alt="RP001" href="pages/response_phases/rp001.html">
  <area shape="rect" coords="898,460,1058,540" alt="RP002" href="pages/response_phases/rp002.html">
  <area shape="rect" coords="1178,660,1338,740" alt="RP003" href="pages/response_phases/rp003.html">
  <area shape="rect" coords="898,900,1058,980" alt="RP004" href="pages/response_phases/rp004.html">
  <area shape="rect" coords="1178,1100,1338,1180" alt="RP005" href="pages/response_phases/rp005.html">
  <area shape="rect" coords="1178,900,1338,980" alt="RP006" href="pages/response_phases/rp006.html">
  <area shape="rect" coords="1458,460,1618,540" alt="RP007" href="pages/response_phases/rp007.html">
  <area shape="rect" coords="1458,780,1618,860" alt="RP008" href="pages/response_phases/rp008.html">
  <area shape="rect" coords="1458,1100,1618,1180" alt="RP009" href="pages/response_phases/rp009.html">
  <area shape="rect" coords="1738,1100,1898,1180" alt="RP010" href="pages/response_phases/rp010.html">
  <area shape="rect" coords="1458,1300,1618,1380" alt="RP011" href="pages/response_phases/rp011.html">
  <area shape="rect" coords="1458,260,1618,340" alt="RP012" href="pages/response_phases/rp012.html">
  <area shape="rect" coords="1738,260,1898,340" alt="RP013" href="pages/response_phases/rp013.html">
  <area shape="rect" coords="2018,1100,2178,1180" alt="RP014" href="pages/response_phases/rp014.html">
  <area shape="rect" coords="2018,780,2178,860" alt="RP015" href="pages/response_phases/rp015.html">
</map>
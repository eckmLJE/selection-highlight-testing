# HIGHLIGHT TESTING

# LOGIC

- Statement body in plaintext is single source of truth for absolute position of highlights. 
- Statement begins as one long string inside a div. 

## Starting Point: No highlights/spans yet exist

- Create initial highlight record using baseOffset and extentOffset of `document.getSelection()`
    - `baseOffset` and `extentOffset` will be relative to surrounding div/beginning of statement (absolute). 
    - This will become a reference for future selections using `document.getSelection().baseNode.previousElementSibling`
- Annotation records store absolute start and end indecies
    - Some of these will overlap!
    - annotation records will be processed into spans

## Overlapping 

- Three spans will be required to highlight two overlapping segments

### Not yet highlighted

<div class="statement">He and Putin seemed to be speaking from the same script as the president made a conscious choice to defend a tyrant against the fair questions of a free press, and to grant Putin an uncontested platform to spew propaganda and lies to the world.</div>

### Single span highlighted

<div class="statement">He and Putin seemed to be speaking from the <span class="highlight" name="00001001">same script as the president</span> made a conscious choice to defend a tyrant against the fair questions of a free press, and to grant Putin an uncontested platform to spew propaganda and lies to the world.</div>

### Overlapping spans highlighted

<div class="statement">He and <span class="highlight" name="00001002">Putin seemed to be speaking from the </span><span class="highlight" name="10021001">same script as the president</span><span class="highlight" name="00001002"> made a conscious choice to defend a tyrant</span> against the fair questions of a free press, and to grant Putin an uncontested platform to spew propaganda and lies to the world.</div>





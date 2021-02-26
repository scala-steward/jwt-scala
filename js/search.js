// When the user clicks on the search box, we want to toggle the search dropdown
function displayToggleSearch(e) {
  e.preventDefault();
  e.stopPropagation();

  closeDropdownSearch(e);
  
  if (idx === null) {
    console.log("Building search index...");
    prepareIdxAndDocMap();
    console.log("Search index built.");
  }
  const dropdown = document.querySelector("#search-dropdown-content");
  if (dropdown) {
    if (!dropdown.classList.contains("show")) {
      dropdown.classList.add("show");
    }
    document.addEventListener("click", closeDropdownSearch);
    document.addEventListener("keydown", searchOnKeyDown);
    document.addEventListener("keyup", searchOnKeyUp);
  }
}

//We want to prepare the index only after clicking the search bar
var idx = null
const docMap = new Map()

function prepareIdxAndDocMap() {
  const docs = [  
    {
      "title": "Home",
      "url": "/jwt-scala/",
      "content": "JWT Scala Scala support for JSON Web Token (JWT). Supports Java 8+, Scala 2.12 and Scala 2.13. Dependency free. Optional helpers for Play Framework, Play JSON, Json4s Native, Json4s Jackson, Circe, uPickle, Spray JSON and Argonaut. This library was originally created by Paul Dijou, you can check the older repository for JWT Scala for older versions. Detailed documentation is on the Microsite. Pick the right tool for the right job JWT Scala is divided in several sub-projects each targeting a specific JSON library. Name Description jwt-core Pure Scala jwt-play-json play-json lib jwt-play Play framework jwt-json4s-native json4s Native implementation jwt-json4s-jackson json4s Jackson implementation jwt-spray-json spray-json lib jwt-circe circe lib jwt-upickle uPickle lib jwt-argonaut Argonaut lib If you need a previous version of the Scaladoc API, check the bottom of this page You can also check a standalone Play application using jwt-play and implementating a small REST API with authentication and admin role (include a UI too!). Install In the following snippet, replace [name] with the actual name of the project you need. Using Java 1.6 or 1.7? Add -legacy after the name of the project and use a version before 2.0.0. See below why. build.sbt libraryDependencies ++= Seq( \"com.github.jwt-scala\" %% \"[name]\" % \"6.0.0\" ) Example for jwt-play using Java 1.6 build.sbt libraryDependencies ++= Seq( \"com.pauldijou\" %% \"jwt-play-legacy\" % \"1.1.0\" ) Algorithms If you are using String key, please keep in mind that such keys need to be parsed. Rather than implementing a super complex parser, the one in JWT Scala is pretty simple and might not work for all use-cases (especially for ECDSA keys). In such case, consider using SecretKey or PrivateKey or PublicKey directly. It is way better for you. All API support all those types. Check ECDSA samples for more infos. Name Description HMD5 HMAC using MD5 algorithm HS224 HMAC using SHA-224 algorithm HS256 HMAC using SHA-256 algorithm HS384 HMAC using SHA-384 algorithm HS512 HMAC using SHA-512 algorithm RS256 RSASSA using SHA-256 algorithm RS384 RSASSA using SHA-384 algorithm RS512 RSASSA using SHA-512 algorithm ES256 ECDSA using SHA-256 algorithm ES384 ECDSA using SHA-384 algorithm ES512 ECDSA using SHA-512 algorithm Security concerns This lib doesn’t want to impose anything, that’s why, by default, a JWT claim is totally empty. That said, you should always add an issuedAt attribute to it, probably using claim.issuedNow. The reason is that even HTTPS isn’t perfect and having always the same chunk of data transfered can be of a big help to crack it. Generating a slightly different token at each request is way better even if it adds a bit of payload to the response. If you are using a session timeout through the expiration attribute which is extended at each request, that’s fine too. I can’t find the article I read about that vulnerability but if someone has some resources about the topic, I would be glad to link them. Contributing If you found any bug or need more documentation, feel free to fill an issue in GitHub. If you want to submit a PR to improve the project, that would be awesome. You can run tests locally for the impacted project, then when your PR is created all tests and linting will be run on github actions. Obviously the PR will have to be green to be merged! Notes Test: run all tests with sbt testAll (if java.lang.LinkageError, just re-run the command) Publish: update version numbers in build.sbt and run sbt release (be sure to either reload inside sbt or start a new sbt) Scaladoc: to manually generate all scaladoc, run sbt scaladoc Publish docs: to manually build and push online the doc website, run sbt publish-doc Docs: to have a locally running doc website: sbt ~docs/makeSite cd docs/target/site jekyll serve Go to http://localhost:4000/jwt-scala/ License This software is licensed under the Apache 2 license, quoted below. Copyright 2021 JWT-Scala Contributors. Licensed under the Apache License, Version 2.0 (the “License”); you may not use this project except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License."
    } ,    
    {
      "title": "Argonaut",
      "url": "/jwt-scala/jwt-argonaut.html",
      "content": "JwtArgonaut object Basic usage import java.time.Instant import scala.util.Try import pdi.jwt.{JwtAlgorithm, JwtArgonaut, JwtClaim} import argonaut.Json val claim = JwtClaim( expiration = Some(Instant.now().plusSeconds(157784760).getEpochSecond), issuedAt = Some(Instant.now.getEpochSecond) ) val key = \"secretKey\" val alg = JwtAlgorithm.HS512 val token = JwtArgonaut.encode(claim, key, alg) val decodedJson: Try[Json] = JwtArgonaut.decodeJson(token, key, Seq(alg)) val decodedClaim: Try[JwtClaim] = JwtArgonaut.decode(token, key, Seq(alg)) Encoding import argonaut.Parse import pdi.jwt.{JwtAlgorithm, JwtArgonaut} val key = \"secretKey\" val alg = JwtAlgorithm.HS512 val jsonClaim = Parse.parseOption(s\"\"\"{\"expires\":${Instant.now().getEpochSecond}}\"\"\").get val jsonHeader = Parse.parseOption(\"\"\"{\"typ\":\"JWT\",\"alg\":\"HS512\"}\"\"\").get val token1: String = JwtArgonaut.encode(jsonClaim) val token2: String = JwtArgonaut.encode(jsonClaim, key, alg) val token3: String = JwtArgonaut.encode(jsonHeader, jsonClaim, key) Decoding import scala.util.Try import argonaut.Json import pdi.jwt.{JwtAlgorithm, JwtArgonaut, JwtClaim, JwtHeader} val claim = JwtClaim( expiration = Some(Instant.now.plusSeconds(157784760).getEpochSecond), issuedAt = Some(Instant.now.getEpochSecond) ) val key = \"secretKey\" val alg = JwtAlgorithm.HS512 val token = JwtArgonaut.encode(claim, key, alg) val decodedJsonClaim: Try[Json] = JwtArgonaut.decodeJson(token, key, Seq(alg)) val decodedJson: Try[(Json, Json, String)] = JwtArgonaut.decodeJsonAll(token, key, Seq(alg)) val decodedClaim: Try[JwtClaim] = JwtArgonaut.decode(token, key, Seq(alg)) val decodedToken: Try[(JwtHeader, JwtClaim, String)] = JwtArgonaut.decodeAll(token, key, Seq(alg))"
    } ,    
    {
      "title": "Circe",
      "url": "/jwt-scala/jwt-circe.html",
      "content": "JwtCirce Object Basic usage import java.time.Instant import pdi.jwt.{JwtCirce, JwtAlgorithm, JwtClaim} val claim = JwtClaim( expiration = Some(Instant.now.plusSeconds(157784760).getEpochSecond) , issuedAt = Some(Instant.now.getEpochSecond) ) val key = \"secretKey\" val algo = JwtAlgorithm.HS256 val token = JwtCirce.encode(claim, key, algo) JwtCirce.decodeJson(token, key, Seq(JwtAlgorithm.HS256)) JwtCirce.decode(token, key, Seq(JwtAlgorithm.HS256)) Encoding import java.time.Instant import cats.syntax.either._ import io.circe._, syntax._, jawn.{parse =&gt; jawnParse} import pdi.jwt.{JwtCirce, JwtAlgorithm, JwtClaim} val key = \"secretKey\" val algo = JwtAlgorithm.HS256 val Right(claimJson) = jawnParse(s\"\"\"{\"expires\":${Instant.now.getEpochSecond}}\"\"\") val Right(header) = jawnParse( \"\"\"{\"typ\":\"JWT\",\"alg\":\"HS256\"}\"\"\") // From just the claim to all possible attributes JwtCirce.encode(claimJson) JwtCirce.encode(claimJson, key, algo) JwtCirce.encode(header, claimJson, key) Decoding import java.time.Instant import pdi.jwt.{JwtCirce, JwtAlgorithm, JwtClaim} val claim = JwtClaim( expiration = Some(Instant.now.plusSeconds(157784760).getEpochSecond) , issuedAt = Some(Instant.now.getEpochSecond) ) val key = \"secretKey\" val algo = JwtAlgorithm.HS256 val token = JwtCirce.encode(claim, key, algo) // You can decode to JsObject JwtCirce.decodeJson(token, key, Seq(JwtAlgorithm.HS256)) JwtCirce.decodeJsonAll(token, key, Seq(JwtAlgorithm.HS256)) // Or to case classes JwtCirce.decode(token, key, Seq(JwtAlgorithm.HS256)) JwtCirce.decodeAll(token, key, Seq(JwtAlgorithm.HS256))"
    } ,    
    {
      "title": "Native",
      "url": "/jwt-scala/jwt-core-jwt.html",
      "content": "Jwt object Basic usage import java.time.Clock import pdi.jwt.{Jwt, JwtAlgorithm, JwtHeader, JwtClaim, JwtOptions} implicit val clock: Clock = Clock.systemUTC val token = Jwt.encode(\"\"\"{\"user\":1}\"\"\", \"secretKey\", JwtAlgorithm.HS256) Jwt.decodeRawAll(token, \"secretKey\", Seq(JwtAlgorithm.HS256)) Jwt.decodeRawAll(token, \"wrongKey\", Seq(JwtAlgorithm.HS256)) Encoding // Encode from string, header automatically generated Jwt.encode(\"\"\"{\"user\":1}\"\"\", \"secretKey\", JwtAlgorithm.HS384) // Encode from case class, header automatically generated // Set that the token has been issued now and expires in 10 seconds Jwt.encode(JwtClaim({\"\"\"{\"user\":1}\"\"\"}).issuedNow.expiresIn(10), \"secretKey\", JwtAlgorithm.HS512) // You can encode without signing it Jwt.encode(\"\"\"{\"user\":1}\"\"\") // You can specify a string header but also need to specify the algorithm just to be sure // This is not really typesafe, so please use it with care Jwt.encode(\"\"\"{\"typ\":\"JWT\",\"alg\":\"HS256\"}\"\"\", \"\"\"{\"user\":1}\"\"\", \"key\", JwtAlgorithm.HS256) // If using a case class header, no need to repeat the algorithm // This is way better than the previous one Jwt.encode(JwtHeader(JwtAlgorithm.HS256), JwtClaim(\"\"\"{\"user\":1}\"\"\"), \"key\") Decoding In JWT Scala, espcially when using raw strings which are not typesafe at all, there are a lot of possible errors. This is why nearly all decode functions will return a Try rather than directly the expected result. In case of failure, the wrapped exception should tell you what went wrong. Take note that nearly all decoding methods (including those from helper libs) support either a String key, or a PrivateKey with a Hmac algorithm or a PublicKey with a RSA or ECDSA algorithm. // Decode all parts of the token as string Jwt.decodeRawAll(token, \"secretKey\", JwtAlgorithm.allHmac) // Decode only the claim as a string Jwt.decodeRaw(token, \"secretKey\", Seq(JwtAlgorithm.HS256)) // Decode all parts and cast them as a better type if possible. // Since the implementation in JWT Core only use string, it is the same as decodeRawAll // But check the result in JWT Play JSON to see the difference Jwt.decodeAll(token, \"secretKey\", Seq(JwtAlgorithm.HS256)) // Same as before, but only the claim // (you should start to see a pattern in the naming convention of the functions) Jwt.decode(token, \"secretKey\", Seq(JwtAlgorithm.HS256)) // Failure because the token is not a token at all Jwt.decode(\"Hey there!\") // Failure if not Base64 encoded Jwt.decode(\"a.b.c\") // Failure in case we use the wrong key Jwt.decode(token, \"wrongKey\", Seq(JwtAlgorithm.HS256)) // Failure if the token only starts in 5 seconds Jwt.decode(Jwt.encode(JwtClaim().startsIn(5))) Validating If you only want to check if a token is valid without decoding it. You have two options: validate functions that will throw the exceptions we saw in the decoding section, so you know what went wrong, or isValid functions that will return a boolean in case you don’t care about the actual error and don’t want to bother with catching exception. // All good Jwt.validate(token, \"secretKey\", Seq(JwtAlgorithm.HS256)) Jwt.isValid(token, \"secretKey\", Seq(JwtAlgorithm.HS256)) // Wrong key here Jwt.validate(token, \"wrongKey\", Seq(JwtAlgorithm.HS256)) Jwt.isValid(token, \"wrongKey\", Seq(JwtAlgorithm.HS256)) // No key for unsigned token =&gt; ok Jwt.validate(Jwt.encode(\"{}\")) Jwt.isValid(Jwt.encode(\"{}\")) // No key while the token is actually signed =&gt; wrong Jwt.validate(token) Jwt.isValid(token) // The token hasn't started yet! Jwt.validate(Jwt.encode(JwtClaim().startsIn(5))) Jwt.isValid(Jwt.encode(JwtClaim().startsIn(5))) // This is no token Jwt.validate(\"a.b.c\") Jwt.isValid(\"a.b.c\") Options All validating and decoding methods support a final optional argument as a JwtOptions which allow you to disable validation checks. This is useful if you need to access data from an expired token for example. You can disable expiration, notBefore and signature checks. Be warned that if you disable the last one, you have no guarantee that the user didn’t change the content of the token. val expiredToken = Jwt.encode(JwtClaim().by(\"me\").expiresIn(-1)); // Fail since the token is expired Jwt.isValid(expiredToken) Jwt.decode(expiredToken) // Let's disable expiration check Jwt.isValid(expiredToken, JwtOptions(expiration = false)) Jwt.decode(expiredToken, JwtOptions(expiration = false)) You can also specify a leeway, in seconds, to account for clock skew. // Allow 30sec leeway Jwt.isValid(expiredToken, JwtOptions(leeway = 30)) Jwt.decode(expiredToken, JwtOptions(leeway = 30))"
    } ,    
    {
      "title": "Json4s",
      "url": "/jwt-scala/jwt-json4s.html",
      "content": "JwtJson4s Object Basic usage import pdi.jwt.{JwtJson4s, JwtAlgorithm}, org.json4s._, org.json4s.JsonDSL.WithBigDecimal._, org.json4s.native.JsonMethods._ val claim = JObject((\"user\", 1), (\"nbf\", 1431520421)) val key = \"secretKey\" val algo = JwtAlgorithm.HS256 JwtJson4s.encode(claim) val token = JwtJson4s.encode(claim, key, algo) JwtJson4s.decodeJson(token, key, Seq(JwtAlgorithm.HS256)) JwtJson4s.decode(token, key, Seq(JwtAlgorithm.HS256)) Encoding val header = JObject((\"typ\", \"JWT\"), (\"alg\", \"HS256\")) JwtJson4s.encode(claim) JwtJson4s.encode(claim, key, algo) JwtJson4s.encode(header, claim, key) Decoding // You can decode to JsObject JwtJson4s.decodeJson(token, key, Seq(JwtAlgorithm.HS256)) JwtJson4s.decodeJsonAll(token, key, Seq(JwtAlgorithm.HS256)) // Or to case classes JwtJson4s.decode(token, key, Seq(JwtAlgorithm.HS256)) JwtJson4s.decodeAll(token, key, Seq(JwtAlgorithm.HS256))"
    } ,    
    {
      "title": "Play Json",
      "url": "/jwt-scala/jwt-play-json.html",
      "content": "JwtJson Object Basic usage import java.time.Clock import pdi.jwt.{JwtJson, JwtAlgorithm} import play.api.libs.json.Json implicit val clock: Clock = Clock.systemUTC val claim = Json.obj((\"user\", 1), (\"nbf\", 1431520421)) val key = \"secretKey\" val algo = JwtAlgorithm.HS256 JwtJson.encode(claim) val token = JwtJson.encode(claim, key, algo) JwtJson.decodeJson(token, key, Seq(JwtAlgorithm.HS256)) JwtJson.decode(token, key, Seq(JwtAlgorithm.HS256)) Encoding val header = Json.obj((\"typ\", \"JWT\"), (\"alg\", \"HS256\")) // From just the claim to all possible attributes JwtJson.encode(claim) JwtJson.encode(claim, key, algo) JwtJson.encode(header, claim, key) Decoding // You can decode to JsObject JwtJson.decodeJson(token, key, Seq(JwtAlgorithm.HS256)) JwtJson.decodeJsonAll(token, key, Seq(JwtAlgorithm.HS256)) // Or to case classes JwtJson.decode(token, key, Seq(JwtAlgorithm.HS256)) JwtJson.decodeAll(token, key, Seq(JwtAlgorithm.HS256)) Formating The project provides implicit reader and writer for both JwtHeader and JwtClaim import pdi.jwt._ import pdi.jwt.JwtJson._ // Reads Json.fromJson[JwtHeader](header) Json.fromJson[JwtClaim](claim) // Writes Json.toJson(JwtHeader(JwtAlgorithm.HS256)) Json.toJson(JwtClaim(\"\"\"{\"user\":1}\"\"\").issuedNow.expiresIn(10)) // Or JwtHeader(JwtAlgorithm.HS256).toJsValue JwtClaim(\"\"\"{\"user\":1}\"\"\").issuedNow.expiresIn(10).toJsValue"
    } ,    
    {
      "title": "Spray Json",
      "url": "/jwt-scala/jwt-spray-json.html",
      "content": "JwtSprayJson Object Basic usage import java.time.Instant import pdi.jwt.{JwtSprayJson, JwtAlgorithm, JwtClaim} val claim = JwtClaim( expiration = Some(Instant.now.plusSeconds(157784760).getEpochSecond), issuedAt = Some(Instant.now.getEpochSecond) ) val key = \"secretKey\" val algo = JwtAlgorithm.HS256 val token = JwtSprayJson.encode(claim, key, algo) JwtSprayJson.decodeJson(token, key, Seq(JwtAlgorithm.HS256)) JwtSprayJson.decode(token, key, Seq(JwtAlgorithm.HS256)) Encoding import java.time.Instant import spray.json._ import pdi.jwt.{JwtSprayJson, JwtAlgorithm, JwtClaim} val key = \"secretKey\" val algo = JwtAlgorithm.HS256 val claimJson = s\"\"\"{\"expires\":${Instant.now.getEpochSecond}}\"\"\".parseJson.asJsObject val header = \"\"\"{\"typ\":\"JWT\",\"alg\":\"HS256\"}\"\"\".parseJson.asJsObject // From just the claim to all possible attributes JwtSprayJson.encode(claimJson) JwtSprayJson.encode(claimJson, key, algo) JwtSprayJson.encode(header, claimJson, key) Decoding import java.time.Instant import pdi.jwt.{JwtSprayJson, JwtAlgorithm, JwtClaim} val claim = JwtClaim( expiration = Some(Instant.now.plusSeconds(157784760).getEpochSecond), issuedAt = Some(Instant.now.getEpochSecond) ) val key = \"secretKey\" val algo = JwtAlgorithm.HS256 val token = JwtSprayJson.encode(claim, key, algo) // You can decode to JsObject JwtSprayJson.decodeJson(token, key, Seq(JwtAlgorithm.HS256)) JwtSprayJson.decodeJsonAll(token, key, Seq(JwtAlgorithm.HS256)) // Or to case classes JwtSprayJson.decode(token, key, Seq(JwtAlgorithm.HS256)) JwtSprayJson.decodeAll(token, key, Seq(JwtAlgorithm.HS256))"
    } ,    
    {
      "title": "upickle",
      "url": "/jwt-scala/jwt-upickle.html",
      "content": "JwtUpickle Object Basic usage import java.time.Instant import upickle.default._ import pdi.jwt.{JwtUpickle, JwtAlgorithm, JwtClaim} val claim = JwtClaim( expiration = Some(Instant.now.plusSeconds(157784760).getEpochSecond), issuedAt = Some(Instant.now.getEpochSecond) ) val key = \"secretKey\" val algo = JwtAlgorithm.HS256 val token = JwtUpickle.encode(claim, key, algo) JwtUpickle.decodeJson(token, key, Seq(JwtAlgorithm.HS256)) JwtUpickle.decode(token, key, Seq(JwtAlgorithm.HS256)) Encoding val key = \"secretKey\" val algo = JwtAlgorithm.HS256 val claimJson = read[ujson.Value](s\"\"\"{\"expires\":${Instant.now.getEpochSecond}}\"\"\") val header = read[ujson.Value]( \"\"\"{\"typ\":\"JWT\",\"alg\":\"HS256\"}\"\"\") // From just the claim to all possible attributes JwtUpickle.encode(claimJson) JwtUpickle.encode(claimJson, key, algo) JwtUpickle.encode(header, claimJson, key) Decoding val claim = JwtClaim( expiration = Some(Instant.now.plusSeconds(157784760).getEpochSecond), issuedAt = Some(Instant.now.getEpochSecond) ) val key = \"secretKey\" val algo = JwtAlgorithm.HS256 val token = JwtUpickle.encode(claim, key, algo) // You can decode to JsObject JwtUpickle.decodeJson(token, key, Seq(JwtAlgorithm.HS256)) JwtUpickle.decodeJsonAll(token, key, Seq(JwtAlgorithm.HS256)) // Or to case classes JwtUpickle.decode(token, key, Seq(JwtAlgorithm.HS256)) JwtUpickle.decodeAll(token, key, Seq(JwtAlgorithm.HS256))"
    } ,        
  ];

  idx = lunr(function () {
    this.ref("title");
    this.field("content");

    docs.forEach(function (doc) {
      this.add(doc);
    }, this);
  });

  docs.forEach(function (doc) {
    docMap.set(doc.title, doc.url);
  });
}

// The onkeypress handler for search functionality
function searchOnKeyDown(e) {
  const keyCode = e.keyCode;
  const parent = e.target.parentElement;
  const isSearchBar = e.target.id === "search-bar";
  const isSearchResult = parent ? parent.id.startsWith("result-") : false;
  const isSearchBarOrResult = isSearchBar || isSearchResult;

  if (keyCode === 40 && isSearchBarOrResult) {
    // On 'down', try to navigate down the search results
    e.preventDefault();
    e.stopPropagation();
    selectDown(e);
  } else if (keyCode === 38 && isSearchBarOrResult) {
    // On 'up', try to navigate up the search results
    e.preventDefault();
    e.stopPropagation();
    selectUp(e);
  } else if (keyCode === 27 && isSearchBarOrResult) {
    // On 'ESC', close the search dropdown
    e.preventDefault();
    e.stopPropagation();
    closeDropdownSearch(e);
  }
}

// Search is only done on key-up so that the search terms are properly propagated
function searchOnKeyUp(e) {
  // Filter out up, down, esc keys
  const keyCode = e.keyCode;
  const cannotBe = [40, 38, 27];
  const isSearchBar = e.target.id === "search-bar";
  const keyIsNotWrong = !cannotBe.includes(keyCode);
  if (isSearchBar && keyIsNotWrong) {
    // Try to run a search
    runSearch(e);
  }
}

// Move the cursor up the search list
function selectUp(e) {
  if (e.target.parentElement.id.startsWith("result-")) {
    const index = parseInt(e.target.parentElement.id.substring(7));
    if (!isNaN(index) && (index > 0)) {
      const nextIndexStr = "result-" + (index - 1);
      const querySel = "li[id$='" + nextIndexStr + "'";
      const nextResult = document.querySelector(querySel);
      if (nextResult) {
        nextResult.firstChild.focus();
      }
    }
  }
}

// Move the cursor down the search list
function selectDown(e) {
  if (e.target.id === "search-bar") {
    const firstResult = document.querySelector("li[id$='result-0']");
    if (firstResult) {
      firstResult.firstChild.focus();
    }
  } else if (e.target.parentElement.id.startsWith("result-")) {
    const index = parseInt(e.target.parentElement.id.substring(7));
    if (!isNaN(index)) {
      const nextIndexStr = "result-" + (index + 1);
      const querySel = "li[id$='" + nextIndexStr + "'";
      const nextResult = document.querySelector(querySel);
      if (nextResult) {
        nextResult.firstChild.focus();
      }
    }
  }
}

// Search for whatever the user has typed so far
function runSearch(e) {
  if (e.target.value === "") {
    // On empty string, remove all search results
    // Otherwise this may show all results as everything is a "match"
    applySearchResults([]);
  } else {
    const tokens = e.target.value.split(" ");
    const moddedTokens = tokens.map(function (token) {
      // "*" + token + "*"
      return token;
    })
    const searchTerm = moddedTokens.join(" ");
    const searchResults = idx.search(searchTerm);
    const mapResults = searchResults.map(function (result) {
      const resultUrl = docMap.get(result.ref);
      return { name: result.ref, url: resultUrl };
    })

    applySearchResults(mapResults);
  }

}

// After a search, modify the search dropdown to contain the search results
function applySearchResults(results) {
  const dropdown = document.querySelector("div[id$='search-dropdown'] > .dropdown-content.show");
  if (dropdown) {
    //Remove each child
    while (dropdown.firstChild) {
      dropdown.removeChild(dropdown.firstChild);
    }

    //Add each result as an element in the list
    results.forEach(function (result, i) {
      const elem = document.createElement("li");
      elem.setAttribute("class", "dropdown-item");
      elem.setAttribute("id", "result-" + i);

      const elemLink = document.createElement("a");
      elemLink.setAttribute("title", result.name);
      elemLink.setAttribute("href", result.url);
      elemLink.setAttribute("class", "dropdown-item-link");

      const elemLinkText = document.createElement("span");
      elemLinkText.setAttribute("class", "dropdown-item-link-text");
      elemLinkText.innerHTML = result.name;

      elemLink.appendChild(elemLinkText);
      elem.appendChild(elemLink);
      dropdown.appendChild(elem);
    });
  }
}

// Close the dropdown if the user clicks (only) outside of it
function closeDropdownSearch(e) {
  // Check if where we're clicking is the search dropdown
  if (e.target.id !== "search-bar") {
    const dropdown = document.querySelector("div[id$='search-dropdown'] > .dropdown-content.show");
    if (dropdown) {
      dropdown.classList.remove("show");
      document.documentElement.removeEventListener("click", closeDropdownSearch);
    }
  }
}

import React, { useState }  from 'react';
import './Documentation.css';
import { Link } from 'react-router-dom';
import LogoPng from '../logo/logoPng2.png';



const Documentation = () => {

    const handleDownloadPDF = () => {
        const pdfFilePath = process.env.PUBLIC_URL + '/Documentation.pdf';

        const link = document.createElement('a');

        link.href = pdfFilePath;

        link.download = 'DocumentationPetri.pdf'; 

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };

   


    return (
       
        <body className="body-container">

   <header className="header flex justify-between items-center h-12 mx-auto px-4 bg-[#20B2AA]">
        <Link to="/" className="logo">
            <img src={LogoPng} alt="Logo" className="w-16 h-10 mr-2 mb-4" />  
        </Link>
        {/*<div className="search-container">
            <input 
                type="text" 
                placeholder="Rechercher..." 

            />
    </div>*/}

    </header>

            <nav className="nav-container" id="navbar">
                <div className="nav-inner-container">
                   
                    <div className="menu-link-container">
                       <a href="#first" class="nav-link"> Définition et Concepts de base </a>
                       <ul className="sub-menu">
                            <li><a href="#first-1" className="sub-nav-link"> Définition formelle </a></li>
                            <li><a href="#first-2" className="sub-nav-link"> Notation matricielle </a></li>
                        </ul>
                       <a href="#second" class="nav-link"> La dynamique d'un réseau de Petri </a>
                       <ul className="sub-menu">
                            <li><a href="#second-1" className="sub-nav-link"> Sensibilisation d'une transition </a></li>
                            <li><a href="#second-2" className="sub-nav-link"> Franchissement d'une transition </a></li>
                            <li><a href="#second-3" className="sub-nav-link"> Séquence de franchissement et MA </a></li>
                            <li><a href="#second-4" className="sub-nav-link"> Graphe des marquages accessibles</a></li>
                        </ul>
                       <a href="#third" class="nav-link"> Réseaux de Petri à arcs inhibiteurs </a>
                       <ul className="sub-menu">
                            <li><a href="#third-1" className="sub-nav-link"> Définition </a></li>
                            <li><a href="#third-2" className="sub-nav-link"> Franchissement dans un RAI </a></li>
                        </ul>
                       <a href="#fourth" class="nav-link"> Propriétés des réseaux de Petri </a>
                       <ul className="sub-menu">
                            <li><a href="#fourth-1" className="sub-nav-link"> Bornitude </a></li>
                            <li><a href="#fourth-2" className="sub-nav-link"> Non blocage </a></li>
                            <li><a href="#fourth-3" className="sub-nav-link"> Vivacité </a></li>
                            <li><a href="#fourth-4" className="sub-nav-link"> Réinitiabilité </a></li>
                            <li><a href="#fourth-5" className="sub-nav-link"> Persistance </a></li>
                        </ul>
                       <a href="#fifth" class="nav-link"> Analyse des réseaux de Petri par énumération</a>
                       <a href="#sixth" class="nav-link"> Réseaux de Petri stochastiques généralisés </a>
                       <ul className="sub-menu">
                            <li><a href="#sixth-1" className="sub-nav-link"> Définition </a></li>
                            <li><a href="#sixth-2" className="sub-nav-link"> Processus Stochastique associé à un RdPSG </a></li>
                            <li><a href="#sixth-3" className="sub-nav-link"> La dynamique des RdPSG </a></li>
                        </ul>
                    </div>
                </div>
            </nav> 
            

            <main className="main-container" id="main-doc">


                <div className="section-container">
                    <section class="main-section" id="first">
                        <header>
                            <h2>Définition et Concepts de base</h2>
                        </header>
                        <p>Un réseau de Petri (RdP) est un graphe biparti orienté composé de deux types de nœuds : les places, qui décrivent les états du système modélisé, et les transitions, qui représentent les changements d'état. Les places et les transitions sont reliées par des arcs orientés.</p>
                        <p>Les arcs sont symbolisés par des flèches allant d'une place à une transition ou vice versa (un arc ne relie jamais deux nœuds de même type). Chaque arc est associé à un poids, généralement égal à 1 par défaut, mais pouvant prendre d'autres valeurs spécifiées sur l'arc. Le poids d'un arc représente le nombre de ressources nécessaires pour déclencher un événement (dans le cas d'une liaison place-transition) ou le nombre de ressources libérées suite à l'occurrence de l'événement représenté par la transition (dans le cas d'une liaison transition-place).</p>
                        <p>Une place peut contenir un nombre entier de jetons ou marques, représentant une condition logique (par exemple, machine en marche ou en panne) ou une ressource (par exemple, serveurs disponibles). L'ensemble des marques présentes dans les places à un instant donné constitue le marquage du réseau à cet instant.</p>
                        <p>Le marquage initial d'un réseau de Petri décrit l'état initial du système modélisé en spécifiant la répartition initiale des marques dans les places.</p>
                        <div class="subsection" id="first-1">
                            <header>
                                <h3>Définition formelle :</h3>
                            </header>
                            <p>Un réseau de Petri est un quadruplet R = (P; T; Pré; Post), tel que :</p>
                            <ul>
                            <li>P = &#123; p<sub>1</sub>, p<sub>2</sub>, p<sub>3</sub>, ..., p<sub>n</sub> &#125;, est un ensemble de places, &#124;P&#124; = n;</li>
                            <li>T = &#123; t<sub>1</sub>, t<sub>2</sub>, t<sub>3</sub>, ..., t<sub>m</sub> &#125;, est l'ensemble des transitions, &#124;T&#124; = m;</li>
                            <li>Pr&eacute; : P &times; T &rarr; &#8469;, est l'application d'incidence avant;</li>
                            <li>Post : P &times; T &rarr; &#8469;, est l'application d'incidence arri&egrave;re.</li>
                            </ul>
                            <p>Pré(pi; tj) est le poids k de l'arc reliant la place pi à la transition tj .</p>
                            <p>Pr&eacute;(p<sub>i</sub>, t<sub>j</sub>) = 
                                <span>&#123;</span>
                                <br />
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> k <span>&nbsp;&nbsp;</span> si l'arc (p<sub>i</sub>, t<sub>j</sub>) existe.
                                <br />
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> 0 <span>&nbsp;&nbsp;</span> sinon.
                                
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&#125;</span>
                            </p>
                            <p>Post(pi; tj) est le poids k de l'arc reliant la transition tj à la place pi.</p>
                            <p>Post(p<sub>i</sub>, t<sub>j</sub>) = 
                                <span>&#123;</span>
                                <br />
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> k <span>&nbsp;&nbsp;</span> si l'arc (p<sub>i</sub>, t<sub>j</sub>) existe.
                                <br />
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> 0 <span>&nbsp;&nbsp;</span> sinon.
                                
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&#125;</span>
                            </p>
                            <p>Un réseau de Petri marqué est défini par un couple Rm = (R;M), tel que :</p>
                            <ul>
                                <li>R est le réseau de Petri défini précédemment ;</li>
                                <li>M : P &rarr; &#8469; , est l'application marquage du réseau, telle que M(pi) est le nombre de jetons dans la place pi.</li>
                            </ul>
                            <p>Si&nbsp;&nbsp;&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML" ><mrow><mo>|</mo><mi>P</mi><mo>|</mo><mo>=</mo><mi>n</mi></mrow></math>&nbsp; alors M(P) est un vecteur à n composantes. Le marquage initial est noté par M0.</p>
                        </div>
                        <div class="subsection" id="first-2">
                            <header>
                                <h3>Notation matricielle :</h3>
                            </header>
                            <p>Les fonctions Pré et Post sont représentées par des matrices W􀀀;W+ à n lignes (nombre de places), m colonnes (nombre de transitions) respectivement.</p>
                                                    <ul>
                            <li>La matrice <math xmlns="http://www.w3.org/1998/Math/MathML" display="inline"><msub><mi>W</mi><mo>&#x2212;</mo></msub><mo>=</mo><mfenced open="[" close="]"><mrow><msub><mi>w</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></mrow></mfenced><mo>,</mo><mtext> où </mtext><msub><mi>w</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mtext>Pré</mtext><mo stretchy="false">(</mo><mi>p</mi><mi>i</mi><mo>,</mo><mi>t</mi><mi>j</mi><mo stretchy="false">)</mo></math>, est appelée matrice d'incidence avant.</li>
                            <li>La matrice <math xmlns="http://www.w3.org/1998/Math/MathML" display="inline"><msub><mi>W</mi><mo>+</mo></msub><mo>=</mo><mfenced open="[" close="]"><mrow><msub><mi>w</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></mrow></mfenced><mo>,</mo><mtext> où </mtext><msub><mi>w</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mtext>Post</mtext><mo stretchy="false">(</mo><mi>p</mi><mi>i</mi><mo>,</mo><mi>t</mi><mi>j</mi><mo stretchy="false">)</mo></math>, est appelée matrice d'incidence arrière.</li>
                            <li>La matrice <math xmlns="http://www.w3.org/1998/Math/MathML" display="inline"><mi>W</mi><mo>=</mo><msub><mi>W</mi><mo>+</mo></msub><mo>&#x2212;</mo><msub><mi>W</mi><mo>&#x2212;</mo></msub><mo>=</mo><mfenced open="[" close="]"><mrow><msub><mi>w</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></mrow></mfenced><mo>,</mo><mtext> est appelée matrice d'incidence.</mtext></math></li>
                            </ul>
                        </div>
                    </section>

                    <section class="main-section" id="second">
                        <header>
                            <h2>La dynamique d'un réseau de Petri</h2>
                        </header>
                        <div class="subsection" id="second-1">
                            <p>L'évolution dynamique d'un réseau de Petri implique le passage d'un marquage à un autre en franchissant une transition, ce qui entraîne la création de nouveaux jetons et la disparition d'autres. Dans cette étude, nous examinerons les conditions nécessaires au franchissement d'une transition ainsi que l'ensemble des marquages accessibles à partir d'un marquage initial M0.</p>
                            <p>Nous avons les notations suivantes :</p>
                            <ul>
                            <li>&deg;t = &#123; p ∈ P | Pre(p, t) &gt; 0 &#125; : ensemble des places d'entrée de t;</li>
                            <li>t&deg; = &#123; p ∈ P | Post(p, t) &gt; 0 &#125; : ensemble des places de sortie de t;</li>
                            <li>&deg;p = &#123; t ∈ T | Post(p, t) &gt; 0 &#125; : ensemble des transitions d'entrée de p;</li>
                            <li>p&deg; = &#123; t ∈ T | Pre(p, t) &gt; 0 &#125; : ensemble des transitions de sortie de p;</li>
                            </ul>
                        </div>
                        <div class="subsection" id="second-2">
                            <header>
                                <h3>Sensibilisation d'une transition :</h3>
                            </header>
                            <p>Une transition t est considérée comme sensibilisée pour un marquage M si le nombre de jetons dans chaque place d'entrée est supérieur à la pondération des arcs reliant ces places à la transition. i.e :</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;t est franchissable pour M &hArr; ∀p ∈ °t : M(p) ≥ Pré(p, t)</p>
                        </div>
                        <div class="subsection" id="second-5">
                            <header>
                                <h3>Franchissement d'une transition :</h3>
                            </header>
                            <p>Le franchissement ou le tir d'une transition t consiste à enlever de chacune des places p en entrée de t le nombre de jetons indiqués sur l'arc entrant à t (i.e. Pré(p; t)), et à déposer dans chacune des places p en sortie un nombre de jetons, égal au poids de l'arc reliant t à p (i.e. Post(p; t)). Le tir d'une transition est supposé être une opération instantanée et indivisible.</p>
                            <p>Étant donné un marquage actuel M, le franchissement d'une transition t sensibilisée donne naissance à un autre marquage M' défini par:</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;∀ <i>p</i> ∈ <i>P</i> : M'(p) = M(p) + Post(p, t) - Pr&eacute;(p, t)</p>
                            <p>On dit aussi que M' est accessible à partir de M et on note : M &#91;t&gt; M'.</p>
                            <p>Une transition source est une transition qui n'a aucune place en entrée. Une telle transition est toujours franchissable et son franchissement est déclenché quand l'évènement correspondant se produit.</p>
                            <p>Une transition puits est une transition qui n'a aucune place en sortie. Lorsque l'évènement correspondant à une telle transition se produit, le tir a lieu en enlevant des marques de toutes les places en entrée de cette transition.</p>
                            <p>Le franchissement des transitions et le changement de marquages qu'il entraîne, permettent d'analyser la dynamique du système modélisé.</p>
                        </div>
                        <div class="subsection" id="second-3">
                            <header>
                                <h3>Séquence de franchissement et marquages accessibles :</h3>
                            </header>
                            <p>Une séquence de franchissement à partir d'un marquage M1 est représentée par la suite des transitions S = t1 t2........ti.......tk telle que le franchissement de chacune d'elles conduit à un marquage qui sensibilise la suivante. Autrement dit :</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8707;(k + 1) marquages M<sub>1</sub>, M<sub>2</sub>,......,M<sub>k+1</sub> : &#8704;i &#8712; &#123;1,.....,k &#125; M<sub>i</sub>&#91;t<sub>i</sub> &gt; M<sub>i+1</sub>  </p>
                            <p>Les marquages M2,........,Mk+1 sont dits accessibles à partir de M1. L'ensemble de tous les marquages accessibles à partir d'un marquage initial M0 est appelé ensemble d'accessibilité, il est noté A(R;M0). On a donc :</p>
                            <p></p>
                        </div>
                        <div class="subsection" id="second-4">
                            <header>
                                <h3>Graphe des marquages accessibles :</h3>
                            </header>
                            <p>Le graphe d'accessibilité (ou graphe de marquages accessibles, ou encore graphe d'états) d'un réseau de Petri R avec un marquage initial M0 est un graphe orienté pondéré. Les nœuds représentent les marquages accessibles (éléments de A(R;M0)), et les arcs représentent les franchissements des transitions. Un nœud mi est relié à mj par un arc de poids t si mj est directement accessible à partir de mi en franchissant la transition t (mi&#91;t&gt;mj).</p>
                        </div>
                    </section>

                    <section class="main-section" id="third">
                        <header><h2>Réseaux de Petri à arcs inhibiteurs</h2></header>
                        <p>Les réseaux de Petri ordinaires peuvent être limités dans certains cas, incapables de modéliser certaines contraintes. Pour pallier ces limitations, d'autres classes de réseaux de Petri ont été définies pour améliorer leur capacité à modéliser des systèmes plus complexes.
                        Dans un réseau de Petri ordinaire, une transition est validée lorsque chacune de ses places d'entrée contient au moins un jeton, ce qui ne permet pas de réaliser un test à zéro, c'est-à-dire conditionner le franchissement d'une transition à l'état vide d'une de ses places d'entrée.
                        Les réseaux de Petri à arcs inhibiteurs sont une extension intéressante qui permet de résoudre ce problème</p>
                        <div class="subsection" id="third-1">
                            <header>
                                <h3>Définition :</h3>
                            </header>
                            <p>Un réseau de Petri à arcs inhibiteurs est un doublet &lt; R; Inh &gt; tel que :</p>
                            <ul>
                            <li>R est un réseau de Petri ;</li>
                            <li>Inh : P &times; T &rarr; &#8469; \ &#123;0&#125; est la fonction d'inhibition.</li>
                            </ul>
                            <p>Un arc inhibiteur est un arc allant d'une place à une transition (et non pasl'inverse). Graphiquement, il est représenté par une flèche avec un petit cercle à l'extrémité.</p>
                            <p>La fonction d'inhibition peut être représentée par une matrice à n lignes, m colonnes, où n = |P|, m = |T|, pour qu'une transition t soit franchissable, la valeur de marquage de chaque place p en entrée doit être strictement inférieure à Inh(p; t).</p>
                        </div>
                        <div class="subsection" id="third-2">
                            <header>
                                <h3>Franchissement dans un RAI :</h3>
                            </header>
                            <p>Soit (R; Inh;M), un réseau de Petri à arcs inhibiteurs marqué, où M est son marquage,</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; t ∈ T  est franchissable ⇔ ∀ p ∈ P : M(p) ≥ Pr&eacute;(p, t) et M(p) &lt; Inh(p, t)</p>
                            <p>Ainsi t n'est franchissable que si le marquage de chacune des places en entrée est inférieur à la valuation de l'arc inhibiteur reliant cette place à cette transition.</p>
                        </div>
                        
                    </section>


                    <section class="main-section" id="fourth">
                        <header><h2>Propriétés des réseaux de Petri</h2></header>
                        <p>L'objectif de la modélisation par réseau de Petri est d'analyser les propriétés qualitatives du système modélisé en étudiant le modèle correspondant du réseau de Petri. Parmi ces propriétés, certaines permettent de confirmer que les spécifications incluses dans le modèle réseau de Petri sont correctes. Cela permet de démontrer que le réseau (et donc le système modélisé) est sans blocage ou que le nombre d'états atteignables est fini. De plus, on peut identifier les conflits entre différentes évolutions possibles.</p>
                        <div class="subsection" id="fourth-1">
                            <header>
                                <h3>Bornitude :</h3>
                            </header>
                            <p>Une place pi est dite bornée pour un marquage initial M0 s'il existe un entier naturel k, tel que pour tout marquage accessible à partir de M0, le nombre de jetons dans pi est inférieur ou égal à k. On dit que pi est k-bornée. Le réseau de Petri R est borné pour le marquage initial M0, si toutes ses places le sont. Autrement dit :</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(R; M<sub>0</sub>) borné ⇔ ∃ k ∈ ℕ; ∀ M ∈ A(R; M<sub>0</sub>); ∀ p ∈ P : M(p) ≤ k</p>
                            <p>On dira également que le nombre de marquages accessibles à partir de l'état initial est fini, le graphe d'accessibilité équivalent peut donc être construit.Dans le cas particulier où k = 1, le réseau de Petri correspondant est dit sauf ou binaire.</p>
                        </div>
                        <div class="subsection" id="fourth-2">
                            <header>
                                <h3>Non blocage :</h3>
                            </header>
                            <p>Un blocage (ou état puits, ou encore marquage mort) est un marquage pour lequel aucune transition n'est franchissable. Un réseau de Petri marqué est dit sans blocage pour un marquage initial M0 si aucun marquage accessible n'est un marquage mort.</p>
                        </div>
                        <div class="subsection" id="fourth-3">
                            <header>
                                <h3>Vivacité :</h3>
                            </header>
                            <p>Soit R un réseau de Petri. Une transition t est quasi-vivante pour un marquage initial M0, si elle est franchissable au moins une fois à partir d'un marquage accessible de M0.</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;t quasi-vivante pour M<sub>0</sub> &hArr; &exist;M &isin; A(R;M0) : M&#91;t&rsaquo; </p>
                            <p>R est quasi-vivant si toutes ses transitions le sont, i.e :</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R est quasi-vivant &hArr; &forall;t &isin; T, &exist;M &isin; A(R;M0) : M&#91;t&rsaquo; </p>
                            <p>Une transition t est vivante pour un marquage initial M0, si pour tout marquage Mi accessible à partir de M0, il existe une séquence de franchissement S qui contient la transition t, autrement dit, quelque soit l'évolution, il existera toujours une possibilité de franchir t.</p>
                            <p>Un réseau de Petri est vivant si toutes ses transitions sont vivantes, c'est-à-dire qu'à partir de tout marquage accessible du marquage initial, toute transition a la possibilité d'être franchie. De façon plus formelle :</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R vivant &hArr; &forall;M &isin; A(R;M0),&forall;t &isin; T, &exist;M' &isin; A(R;M) : M'&#91;t&rsaquo; </p>
                        </div>
                        <div class="subsection" id="fourth-4">
                            <header>
                                <h3>Réinitiabilité :</h3>
                            </header>
                            <p>On dit qu'un réseau de Petri R possède un état d'accueil Ma, siMa est accessible de tous les marquages accessibles du marquage initial M0.</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;M<sub>a</sub> est un état d'accueil &hArr; &forall;M &isin; A(R;M0), &exist;S &isin;T* : M&#91;S&rsaquo;M<sub>a</sub> </p>
                            <p>Le réseau de Petri est dit réinitialisable (propre) s'il admet M0 comme état d'accueil.</p>
                        </div>
                        <div class="subsection" id="fourth-5">
                            <header>
                                <h3>Persistance :</h3>
                            </header>
                            <p>On dira que deux transitions sont en conflit structurel si elles ont au moins une place commune en entrée. Le conflit structurel ne dépend pas du marquage. En présence de marquage, le franchissement d'une transition en conflit structurel peut empêcher le franchissement de l'autre, on parle dans ce cas de conflit effectif</p>
                            <p>Dans un réseau de Petri à conflit effectif, il est nécessaire de faire un choix de la transition qui va être franchie.</p>
                            <p>Un conflit effectif signifie qu'il y a un non-déterminisme du réseau, donc que l'évolution du système décrit présente une partie aléatoire.</p>
                            <p>On dit qu'un réseau de Petri est simple si toute transition ne peut être concernée que par un conflit au plus.</p>
                        </div>
                    </section>

                    <section class="main-section" id="fifth">
                        <header><h2>Analyse des réseaux de Petri par énumération</h2></header>
                        <p>Avant de passer à l'étape de mise en œuvre, il est crucial que le système ne présente aucune erreur ni ambiguïté dans la spécification des fonctions qui le composent. La détection tardive des erreurs de conception peut entraîner des coûts importants. C'est pourquoi toute modélisation doit être suivie d'une étape de validation du modèle de réseau de Petri, afin d'obtenir des informations précises sur les propriétés du système en étudiant les propriétés du réseau de Petri équivalent.</p>
                        <p>Il existe plusieurs approches d'analyse dans la littérature, chacune ayant ses avantages et ses inconvénients. En général, une méthode d'analyse permet de vérifier les propriétés des réseaux de Petri et conduit à la définition d'un algorithme de validation.</p>
                        <p>L'analyse par énumération implique la construction du graphe des marquages accessibles (graphe de couverture). Si ce graphe est fini, la vérification de certaines propriétés devient plus facile. Cependant, cette méthode présente l'inconvénient de provoquer une explosion du nombre d'états du graphe de couverture, même lorsque le nombre de places et de transitions reste faible dans le réseau de Petri équivalent. Cela rend l'analyse coûteuse en termes de temps d'exécution et d'espace mémoire.</p>
                    </section>

                    <section class="main-section" id="sixth">
                    <header>
                        <h2>Réseaux de Petri stochastiques généralisés</h2>
                    </header>
                    <p>Les modèles de réseaux de Petri sont enrichis pour que l'analyse quantitative des systèmes modélisés soit possible. L'introduction des spécifications temporelles a eu lieu avec différentes approches... En particulier, les réseaux de Petri stochastiques (RdPS) sont des réseaux de Petri où, à chaque transition est associée une variable aléatoire modélisant le délai de franchissement de cette transition i.e. l'intervalle de temps qui sépare l'instant de déclenchement de l'instant de la fin de l'évènement représenté par la transition.</p>
                    <p>Dans les RdPS les durées d'exécution de toutes les actions dans les systèmes modélisés, sont associées à un temps aléatoire, or, dans les systèmes réels,ceci n'est pas toujours vrai ; c'est le cas par exemple des opérations de synchronisation, des opérations d'allocation des ressources, ou bien des actions purement logiques dans les systèmes informatiques. En effet, les transactions associées à ce genre d'actions doivent être immédiates.</p>
                    <p>Les modèles RdPS dans lesquels les actions logiques sont représentées par des transitions dont la durée de franchissement est nulle sont connus sous le nom RdPS généralisés, RdPSG. Les RdPSG combinent alors deux types de transitions ; les transitions immédiates (qui sont représentées par des rectangles noirs), et celles temporisées, (représentées pas des rectangles vides).</p>
                    <ul>
                        <li>Les transitions temporisées sont des transitions dont les délais de franchissement sont associés à des variables aléatoires déterminant la durée d'exécution des différentes activités. Quand ces délais de franchissement sont des variables aléatoires à distributions exponentielles négatives, on parle de RdPSG markoviens.</li>
                        <li>Les transitions immédiates (instantanées), se caractérisent par un délai de franchissement nul, permettant ainsi de représenter les actions prioritaires qui ne consomment aucun temps, comme la synchronisation, les opérations logiques, les évènements d'urgence ou les activités prioritaires. Il est à noter que ces transitions sont plus prioritaires que les transitions temporisées. De plus, plusieurs niveaux de priorités peuvent être définis entres les transitions immédiates en définissant un poids pour chaque transition.</li>
                    </ul>
                    <p>Nous nous intéressons dans ce projet à la classe des RdPSG markoviens. Ainsi, dans ce qui suit, le mot RdPSG désignera implicitement un RdPSG markovien.</p>
                    <div class="subsection" id="sixth-1">
                        <header>
                        <h3>definition :</h3>
                        </header>
                        <p>Un Réseau de Petri Stochastique Généralisé, RdPSG, est défini formellement par un 8-uplet &lt; P; T; Pré; Post; Inh; pri;W;M0 &gt; tel que :</p>
                        <ul>
                        <li>P est l'ensemble des places ;</li>
                        <li>T est l'ensemble des transitions (immédiates et temporisées) ;</li>
                        <li>Pr&eacute; : P &times; T &rarr; &#8469;, est la fonction d'incidence avant ;</li>
                        <li>Post : P &times; T &rarr; &#8469;, la fonction d'incidence arri&egrave;re ;</li>
                        <li>Inh : P &times; T &rarr; &#8469;, la fonction d'inhibition ;</li>
                        <li>pri : T &rarr; &#123;0, 1&#125;, est la fonction de priorit&eacute;, elle associe &agrave; chaque transition temporis&eacute;e la valeur 0 et &agrave; chaque transition imm&eacute;diate la valeur 1 (la valeur 1 est plus prioritaire que la valeur 0) ;</li>
                        <li>W : T &rarr; &#8477;<sup>+</sup>, la fonction qui associe &agrave; chaque transition temporis&eacute;e un d&eacute;lai de franchissement, et &agrave; chaque transition imm&eacute;diate un poids. Les poids sont utilis&eacute;s dans le calcul des probabilit&eacute;s de franchissement des transitions imm&eacute;diates et pour la r&eacute;solution des conflits entre plusieurs transitions imm&eacute;diates ;</li>
                        <li>M<sub>0</sub> : P &rarr; &#8469;, est le marquage initial du r&eacute;seau.</li>
                        </ul>

                    </div>
                    <div class="subsection" id="sixth-2">
                        <header>
                        <h3>Processus Stochastique associé à un RdPSG :</h3>
                        </header>
                        <p>À cause de la présence de transitions immédiates, l'ensemble des marquages accessibles d'un RdPSG contient deux types de marquages:</p>
                        <ul>
                        <li>Les marquages tangibles ; dans lesquels aucune transition immédiate n'est sensibilisée,</li>
                        <li>Les marquages évanescents ; où il y a au moins une transition immédiate franchissable. </li>
                        </ul>
                        <p>Les marquages tangibles représentent les états où le système modélisé passe un certain temps, les marquages évanescents, cependant, modélisent les états dans lesquels le temps passé est nul. Le processus stochastique associé à un RdPSG est un processus stochastique semi-markovien, où la distribution de temps de séjour dans les marquages est une composition de distributions exponentielles négatives et distributions déterministes nulles.</p>
                        <p>Le temps moyen de séjour dans un marquage évanescent est nul, tandis que, le temps de séjour dans un marquage tangible M est une variable aléatoire correspondant au minimum des temps de franchissement des transitions sensibilisées par ce marquage, autrement dit, c'est une loi exponentielle avec un paramètre &lambda;<sub>M</sub> qui est la somme de tous les taux de franchissement de ces transitions :</p>
                        <p>λ<sub>m</sub> = ∑ <sub><sub> <sub><sub>t ∈ S(M)</sub></sub></sub></sub>w(t<sub>K</sub> ) </p>
                        <p>où S(M) est l'ensemble des transitions franchissables à partir de M.</p>
                        <p>Par conséquent, le temps moyen de séjour dans ce marquage est donné par :</p>
                        <br/>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontFamily: 'Cambria Math, sans-serif', fontSize: '24px' }}>
                                T<sub>M</sub> = 
                                <span style={{ verticalAlign: 'middle' }}>
                                    <sup>1</sup>
                                    <span >/</span>
                                </span>
                                <span style={{ fontSize: 'smaller' }}>
                                    λ<sub>M</sub>
                                </span> = 
                                <span style={{ verticalAlign: 'middle' }}>
                                    <sup>1</sup>
                                    <span >/</span>
                                </span>
                                <span style={{ fontSize: 'smaller' }}>
                                    ∑<sub style={{ fontSize: 'smaller' }}>t<sub>k</sub>∈S<sub>M</sub></sub>
                                </span>
                                w(t<sub>k</sub>)
                            </span>
                        </div>
                    </div>
                    <div class="subsection" id="sixth-3">
                        <header>
                        <h3>La dynamique des RdPSG :</h3>
                        </header>
                        <p>Tout comme les RdP ordinaires, l'évolution d'un RdPSG se fait par une suite successive de marquages. Lorsqu'un marquage M est atteint, on distingue deux scénarios pour passer à un autre marquage selon que ce M soit tangible ou évanescent. Soit S(M) l'ensemble de transitions sensibilisées de ce marquage ;</p>
                        <ul>
                        <li>Si S(M) ne contient que des transitions temporisées (marquage tangible), tous les évènements associés aux transitions sensibilisées commencent à s'exécuter en parallèle, cependant, le changement de l'état du réseau est provoqué par le déclenchement de la transition ayant le plus petit délai de franchissement. Cette politique modélise ce que l'on appelle modèle concurrentiel, et c'est la plus utilisée en pratique. La probabilité qu'une transition t<sub>j</sub> &#8712; S(M) ait le plus petit délai de franchissement est donnée par la formule suivante :</li>
                        <p>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontFamily: 'Cambria Math, sans-serif', fontSize: '24px' }}>
                                P[t<sub>j</sub> | M] = 
                                <span>          </span>
                                <span style={{ verticalAlign: 'middle' }}>
                                <sup style ={{fontSize: '22px'}} ><span>w(t<sub>j</sub>)</span> </sup> 
                                    <span >/</span>
                                    <span style={{ fontSize: 'smaller' }}>
                                        ∑<sub style={{ fontSize: 'smaller' }}>t<sub>k</sub>∈S<sub>M</sub></sub>
                                    </span>
                                    w(t<sub>k</sub>)
                                </span>
                            </span>
                        </div>
                        </p>
                        <li>Si M est un marquage évanescent, i.e. S(M) comprend au moins une transition immédiate, seulement les transitions immédiates ont la possibilité d'être tirées car elles sont plus propriétaires que les transitions temporisées, vu leur temps de franchissement nul. Laquelle des transitions immédiates sera tirée si on en a plusieurs, ce problème ne peut se poser qu'en cas de transitions en conflit effectif, les transitions concurrentes pouvant être simultanément tirées. Si S(M) contient plusieurs transitions en conflit, une seule transition pourra être tirée avec une certaine probabilité qui dépend du poids de chaque transition en conflit, soit C(M) &sub; S(M) l'ensemble des transitions immédiates en conflit entre elles, la probabilité qu'une transition t<sub>j</sub> &#8712; C(M) soit tirée est donnée par :</li>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontFamily: 'Cambria Math, sans-serif', fontSize: '24px' }}>
                                P[t<sub>j</sub> | M] = 
                                <span>          </span>
                                <span style={{ verticalAlign: 'middle' }}>
                                <sup style ={{fontSize: '22px'}} ><span>w(t<sub>j</sub>)</span> </sup> 
                                    <span >/</span>
                                    <span style={{ fontSize: 'smaller' }}>
                                        ∑<sub style={{ fontSize: 'smaller' }}>t<sub>k</sub>∈C(M)</sub>
                                    </span>
                                    w(t<sub>k</sub>)
                                </span>
                            </span>
                        </div>
                        <p>Le nouveau marquage M0 résultant après le franchissement d'une transition tj (temporisée ou immédiate) à partir d'un marquage M est toujours défini comme suit : M0 = M - Pré(., tj) + Post(., tj)</p>
                        </ul>
                    </div>
                    </section>
                        
                </div>
                
                <footer onClick={handleDownloadPDF}>
                    <div >Télécharger le document</div>
                </footer>
            </main>
        </body>
        
    );
}

export default Documentation;
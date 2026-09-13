"use strict";

/* =========================================================
   DREAM HUNT — BUY COURSES
   PURE JAVASCRIPT
   No HTML markup required
========================================================= */

const SUPABASE_URL =
    "https://rndtgjuwwsxxiiezennr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_mIQfKUUsEOlDtqEdroMpgQ_I8ElRcsN";

const COUPON_CODE = "DH151044";
const COUPON_DISCOUNT = 50;

let supabaseClient;
let currentUser = null;
let courses = [];
let selectedCourseIds = [];
let couponApplied = false;


/* =========================================================
   HELPERS
========================================================= */

function el(tag, props = {}, children = []) {

    const node = document.createElement(tag);

    Object.entries(props).forEach(([key, value]) => {

        if (key === "className") {
            node.className = value;
        }

        else if (key === "text") {
            node.textContent = value;
        }

        else if (key === "value") {
            node.value = value;
        }

        else if (key === "placeholder") {
            node.placeholder = value;
        }

        else if (key === "type") {
            node.type = value;
        }

        else if (key === "id") {
            node.id = value;
        }

        else {
            node.setAttribute(key, value);
        }

    });

    children.forEach(child => {

        if (child)
            node.appendChild(child);

    });

    return node;
}


function money(amount) {
    return `৳${Number(amount || 0)}`;
}


/* =========================================================
   CSS
========================================================= */

function addStyles() {

    const style = document.createElement("style");

    style.textContent = `

    *{
        box-sizing:border-box;
    }

    body{
        margin:0;
        background:#070b14;
        color:#f5f7fb;
        font-family:Inter,Arial,sans-serif;
    }

    .dh-buy{
        min-height:100vh;
        padding:30px 18px;
        background:
        radial-gradient(
            circle at 10% 0%,
            rgba(124,92,255,.14),
            transparent 30%
        ),
        radial-gradient(
            circle at 100% 30%,
            rgba(37,211,155,.07),
            transparent 28%
        ),
        #070b14;
    }

    .dh-wrap{
        max-width:1180px;
        margin:auto;
    }

    .dh-title{
        margin-bottom:25px;
    }

    .dh-title h1{
        margin:0;
        font-size:34px;
        font-weight:850;
        letter-spacing:-1px;
    }

    .dh-title p{
        margin:8px 0 0;
        color:#8f9bad;
        font-size:14px;
    }

    .dh-grid{
        display:grid;
        grid-template-columns:minmax(0,1fr) 360px;
        gap:22px;
        align-items:start;
    }

    .dh-card{
        background:rgba(16,23,37,.9);
        border:1px solid rgba(255,255,255,.08);
        border-radius:20px;
        padding:22px;
        box-shadow:0 20px 60px rgba(0,0,0,.25);
        backdrop-filter:blur(15px);
    }

    .dh-card + .dh-card{
        margin-top:20px;
    }

    .dh-card-head{
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:18px;
    }

    .dh-card-head h2{
        margin:0;
        font-size:18px;
    }

    .dh-card-head span{
        color:#8f9bad;
        font-size:12px;
    }

    .dh-courses{
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:14px;
    }

    .dh-course{
        cursor:pointer;
        padding:18px;
        border-radius:17px;
        border:1px solid rgba(255,255,255,.08);
        background:#101725;
        transition:.2s;
    }

    .dh-course:hover{
        transform:translateY(-2px);
        border-color:#7c5cff;
    }

    .dh-course.selected{
        border-color:#7c5cff;
        background:rgba(124,92,255,.12);
        box-shadow:
            0 0 0 1px rgba(124,92,255,.15);
    }

    .dh-course-top{
        display:flex;
        align-items:flex-start;
        gap:12px;
    }

    .dh-check{
        width:21px;
        height:21px;
        border-radius:6px;
        border:1px solid #647084;
        flex:none;
        display:flex;
        align-items:center;
        justify-content:center;
    }

    .dh-course.selected .dh-check{
        background:#7c5cff;
        border-color:#7c5cff;
    }

    .dh-check::after{
        content:"✓";
        opacity:0;
        font-size:13px;
        font-weight:bold;
    }

    .dh-course.selected .dh-check::after{
        opacity:1;
    }

    .dh-course-name{
        font-weight:750;
        font-size:15px;
    }

    .dh-course-category{
        margin-top:5px;
        color:#9b7cff;
        font-size:10px;
        text-transform:uppercase;
        letter-spacing:.7px;
    }

    .dh-course-description{
        margin-top:12px;
        color:#8f9bad;
        font-size:12px;
        line-height:1.6;
    }

    .dh-form{
        display:grid;
        gap:14px;
    }

    .dh-two{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:14px;
    }

    .dh-field{
        display:flex;
        flex-direction:column;
        gap:7px;
    }

    .dh-field label{
        color:#b8c1d0;
        font-size:12px;
        font-weight:600;
    }

    .dh-field input{
        width:100%;
        height:48px;
        padding:0 14px;
        border-radius:12px;
        border:1px solid rgba(255,255,255,.08);
        outline:none;
        background:#0b111d;
        color:white;
        font-size:14px;
    }

    .dh-field input:focus{
        border-color:#7c5cff;
        box-shadow:
            0 0 0 3px rgba(124,92,255,.12);
    }

    .dh-coupon{
        display:flex;
        gap:9px;
    }

    .dh-coupon input{
        flex:1;
    }

    .dh-apply{
        height:48px;
        padding:0 18px;
        border:0;
        border-radius:12px;
        background:#7c5cff;
        color:white;
        font-weight:750;
        cursor:pointer;
    }

    .dh-coupon-msg{
        min-height:17px;
        margin-top:5px;
        font-size:12px;
    }

    .dh-summary{
        position:sticky;
        top:20px;
    }

    .dh-summary-head{
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:18px;
    }

    .dh-summary-head h2{
        margin:0;
        font-size:18px;
    }

    .dh-badge{
        padding:6px 10px;
        border-radius:20px;
        background:rgba(124,92,255,.13);
        color:#b8a7ff;
        font-size:10px;
        font-weight:750;
    }

    .dh-row{
        display:flex;
        justify-content:space-between;
        gap:15px;
        padding:12px 0;
        border-bottom:1px solid rgba(255,255,255,.055);
        font-size:13px;
    }

    .dh-row span{
        color:#8f9bad;
    }

    .dh-row strong{
        text-align:right;
    }

    .dh-discount{
        color:#25d39b;
    }

    .dh-total{
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-top:15px;
        padding:17px;
        border-radius:15px;
        background:rgba(124,92,255,.09);
        border:1px solid rgba(124,92,255,.15);
    }

    .dh-total small{
        color:#8f9bad;
    }

    .dh-total strong{
        font-size:25px;
    }

    .dh-chips{
        display:flex;
        flex-wrap:wrap;
        gap:7px;
        margin-top:15px;
    }

    .dh-chip{
        padding:6px 9px;
        border-radius:8px;
        background:#182235;
        color:#cbd4e2;
        font-size:10px;
    }

    .dh-proceed{
        width:100%;
        height:52px;
        margin-top:18px;
        border:0;
        border-radius:14px;
        background:linear-gradient(
            135deg,
            #7c5cff,
            #9b7cff
        );
        color:white;
        font-weight:800;
        cursor:pointer;
    }

    .dh-proceed:disabled{
        opacity:.45;
        cursor:not-allowed;
    }

    .dh-message{
        display:none;
        padding:12px 14px;
        margin-bottom:15px;
        border-radius:11px;
        font-size:13px;
    }

    .dh-message.show{
        display:block;
    }

    .dh-error{
        color:#ff9baa;
        background:rgba(255,93,115,.08);
        border:1px solid rgba(255,93,115,.15);
    }

    .dh-success{
        color:#71e8c0;
        background:rgba(37,211,155,.08);
        border:1px solid rgba(37,211,155,.15);
    }

    .dh-loading{
        padding:35px;
        text-align:center;
        color:#8f9bad;
    }

    @media(max-width:850px){

        .dh-grid{
            grid-template-columns:1fr;
        }

        .dh-summary{
            position:static;
        }

    }

    @media(max-width:560px){

        .dh-buy{
            padding:18px 12px;
        }

        .dh-title h1{
            font-size:28px;
        }

        .dh-card{
            padding:16px;
        }

        .dh-courses,
        .dh-two{
            grid-template-columns:1fr;
        }

        .dh-coupon{
            flex-direction:column;
        }

        .dh-apply{
            width:100%;
        }

    }

    `;

    document.head.appendChild(style);
}


/* =========================================================
   BUILD PAGE
========================================================= */

function buildPage(){

    document.body.innerHTML = "";

    const page = el("main", {
        className:"dh-buy"
    });

    const wrap = el("div", {
        className:"dh-wrap"
    });

    const title = el("div", {
        className:"dh-title"
    });

    title.appendChild(
        el("h1", {
            text:"Buy Courses"
        })
    );

    title.appendChild(
        el("p", {
            text:
            "Choose your admission categories and build your Dream Hunt package."
        })
    );


    const message = el("div", {
        id:"dhMessage",
        className:"dh-message"
    });


    const grid = el("div", {
        className:"dh-grid"
    });


    /* LEFT */

    const left = el("div");


    const courseCard = el("section", {
        className:"dh-card"
    });

    const courseHead = el("div", {
        className:"dh-card-head"
    });

    courseHead.appendChild(
        el("h2", {
            text:"Select Categories"
        })
    );

    courseHead.appendChild(
        el("span", {
            id:"dhCourseCount",
            text:"Loading..."
        })
    );

    const courseContainer = el("div", {
        id:"dhCourses",
        className:"dh-courses"
    });

    courseContainer.appendChild(
        el("div", {
            className:"dh-loading",
            text:"Loading courses..."
        })
    );

    courseCard.appendChild(courseHead);
    courseCard.appendChild(courseContainer);


    /* STUDENT */

    const studentCard = el("section", {
        className:"dh-card"
    });

    const studentHead = el("div", {
        className:"dh-card-head"
    });

    studentHead.appendChild(
        el("h2", {
            text:"Student Verification"
        })
    );

    studentHead.appendChild(
        el("span", {
            text:"Required"
        })
    );

    const form = el("div", {
        className:"dh-form"
    });


    const two1 = el("div", {
        className:"dh-two"
    });


    const rollField = el("div", {
        className:"dh-field"
    });

    rollField.appendChild(
        el("label", {
            text:"HSC Roll"
        })
    );

    rollField.appendChild(
        el("input", {
            id:"dhHscRoll",
            type:"text",
            placeholder:"Enter HSC roll"
        })
    );


    const regField = el("div", {
        className:"dh-field"
    });

    regField.appendChild(
        el("label", {
            text:"HSC Registration"
        })
    );

    regField.appendChild(
        el("input", {
            id:"dhHscRegistration",
            type:"text",
            placeholder:"Enter HSC registration"
        })
    );

    two1.appendChild(rollField);
    two1.appendChild(regField);


    const two2 = el("div", {
        className:"dh-two"
    });


    const yearField = el("div", {
        className:"dh-field"
    });

    yearField.appendChild(
        el("label", {
            text:"HSC Year"
        })
    );

    yearField.appendChild(
        el("input", {
            id:"dhHscYear",
            type:"text",
            placeholder:"Loading...",
            readonly:"readonly"
        })
    );


    const boardField = el("div", {
        className:"dh-field"
    });

    boardField.appendChild(
        el("label", {
            text:"Board"
        })
    );

    boardField.appendChild(
        el("input", {
            id:"dhBoard",
            type:"text",
            placeholder:"Loading...",
            readonly:"readonly"
        })
    );

    two2.appendChild(yearField);
    two2.appendChild(boardField);


    const couponField = el("div", {
        className:"dh-field"
    });

    couponField.appendChild(
        el("label", {
            text:"Coupon"
        })
    );

    const couponBox = el("div", {
        className:"dh-coupon"
    });

    couponBox.appendChild(
        el("input", {
            id:"dhCoupon",
            type:"text",
            placeholder:"Enter coupon code"
        })
    );

    couponBox.appendChild(
        el("button", {
            id:"dhApplyCoupon",
            className:"dh-apply",
            text:"Apply",
            type:"button"
        })
    );

    couponField.appendChild(couponBox);

    couponField.appendChild(
        el("div", {
            id:"dhCouponMsg",
            className:"dh-coupon-msg"
        })
    );


    form.appendChild(two1);
    form.appendChild(two2);
    form.appendChild(couponField);

    studentCard.appendChild(studentHead);
    studentCard.appendChild(form);


    left.appendChild(courseCard);
    left.appendChild(studentCard);


    /* RIGHT SUMMARY */

    const summary = el("aside", {
        className:"dh-card dh-summary"
    });

    const summaryHead = el("div", {
        className:"dh-summary-head"
    });

    summaryHead.appendChild(
        el("h2", {
            text:"Order Summary"
        })
    );

    summaryHead.appendChild(
        el("span", {
            id:"dhBadge",
            className:"dh-badge",
            text:"Select"
        })
    );

    summary.appendChild(summaryHead);


    function addRow(id,label,value,extraClass=""){

        const row = el("div", {
            className:"dh-row"
        });

        row.appendChild(
            el("span", {
                text:label
            })
        );

        row.appendChild(
            el("strong", {
                id:id,
                className:extraClass,
                text:value
            })
        );

        summary.appendChild(row);
    }


    addRow(
        "dhSelected",
        "Selected",
        "0 categories"
    );

    addRow(
        "dhPackage",
        "Package",
        "—"
    );

    addRow(
        "dhOriginal",
        "Original Price",
        "৳0"
    );

    addRow(
        "dhDiscount",
        "Coupon Discount",
        "- ৳0",
        "dh-discount"
    );


    const total = el("div", {
        className:"dh-total"
    });

    total.appendChild(
        el("small", {
            text:"Total Payable"
        })
    );

    total.appendChild(
        el("strong", {
            id:"dhTotal",
            text:"৳0"
        })
    );

    summary.appendChild(total);


    summary.appendChild(
        el("div", {
            id:"dhChips",
            className:"dh-chips"
        })
    );


    summary.appendChild(
        el("button", {
            id:"dhProceed",
            className:"dh-proceed",
            text:"Proceed to Payment",
            type:"button",
            disabled:"disabled"
        })
    );


    summary.appendChild(
        el("div", {
            className:"dh-loading",
            text:
            "Your final package price will be calculated from your selected categories."
        })
    );


    grid.appendChild(left);
    grid.appendChild(summary);

    wrap.appendChild(title);
    wrap.appendChild(message);
    wrap.appendChild(grid);

    page.appendChild(wrap);

    document.body.appendChild(page);
}


/* =========================================================
   MESSAGES
========================================================= */

function showMessage(text,type="error"){

    const box =
        document.getElementById("dhMessage");

    box.textContent = text;

    box.className =
        `dh-message show ${
            type === "success"
            ? "dh-success"
            : "dh-error"
        }`;
}


/* =========================================================
   AUTH
========================================================= */

async function checkAuth(){

    const {
        data,
        error
    } =
    await supabaseClient.auth.getSession();

    if(error)
        throw error;

    currentUser =
        data.session?.user || null;

    if(!currentUser){

        showMessage(
            "Please login first to continue."
        );

        setTimeout(()=>{
            window.location.href =
                "login.html";
        },1000);

        return false;
    }

    return true;
}


/* =========================================================
   STUDENT PROFILE
========================================================= */

async function loadStudentProfile(){

    const {
        data,
        error
    } =
    await supabaseClient
        .from("student_profiles")
        .select(
            "id,hsc_year,board"
        )
        .eq("id",currentUser.id)
        .maybeSingle();

    if(error)
        throw error;

    document.getElementById(
        "dhHscYear"
    ).value =
        data?.hsc_year || "";

    document.getElementById(
        "dhBoard"
    ).value =
        data?.board || "";
}


/* =========================================================
   COURSES
========================================================= */

async function loadCourses(){

    const {
        data,
        error
    } =
    await supabaseClient
        .from("courses")
        .select(`
            id,
            name,
            slug,
            category,
            description,
            is_active,
            is_published
        `)
        .eq("is_active",true)
        .eq("is_published",true)
        .order("created_at",{
            ascending:true
        });

    if(error)
        throw error;

    courses = data || [];

    renderCourses();
}


function renderCourses(){

    const container =
        document.getElementById(
            "dhCourses"
        );

    const count =
        document.getElementById(
            "dhCourseCount"
        );

    count.textContent =
        `${courses.length} available`;


    container.innerHTML = "";


    if(!courses.length){

        container.appendChild(
            el("div",{
                className:"dh-loading",
                text:"No courses available."
            })
        );

        return;
    }


    courses.forEach(course=>{

        const card =
            el("div",{
                className:"dh-course"
            });

        card.dataset.courseId =
            course.id;


        const top =
            el("div",{
                className:"dh-course-top"
            });


        top.appendChild(
            el("div",{
                className:"dh-check"
            })
        );


        const info =
            el("div");


        info.appendChild(
            el("div",{
                className:"dh-course-name",
                text:course.name
            })
        );


        info.appendChild(
            el("div",{
                className:"dh-course-category",
                text:course.category || "Admission"
            })
        );


        top.appendChild(info);


        card.appendChild(top);


        card.appendChild(
            el("div",{
                className:"dh-course-description",
                text:
                    course.description ||
                    "Admission preparation course."
            })
        );


        card.addEventListener(
            "click",
            ()=>{
                toggleCourse(course.id);
            }
        );


        container.appendChild(card);

    });
}


/* =========================================================
   SELECT COURSE
========================================================= */

function toggleCourse(courseId){

    if(
        selectedCourseIds.includes(courseId)
    ){

        selectedCourseIds =
            selectedCourseIds.filter(
                id => id !== courseId
            );

    }else{

        selectedCourseIds.push(courseId);

    }

    updateCourseCards();
    updateSummary();
}


function updateCourseCards(){

    document
        .querySelectorAll(".dh-course")
        .forEach(card=>{

            const id =
                card.dataset.courseId;

            card.classList.toggle(
                "selected",
                selectedCourseIds.includes(id)
            );

        });
}


/* =========================================================
   PRICE
========================================================= */

function calculatePrice(){

    const count =
        selectedCourseIds.length;

    const total =
        courses.length;

    if(count === 0)
        return 0;

    if(count === 1)
        return 300;

    if(count === 2)
        return 500;

    if(count === 3)
        return 800;

    if(count >= total)
        return 1000;

    return 1000;
}


function packageName(){

    const count =
        selectedCourseIds.length;

    if(count === 0)
        return "—";

    if(count === 1)
        return "1 Category";

    if(count === 2)
        return "2 Categories";

    if(count === 3)
        return "3 Categories";

    if(count >= courses.length)
        return "All Categories";

    return "All Categories";
}


/* =========================================================
   SUMMARY
========================================================= */

function updateSummary(){

    const count =
        selectedCourseIds.length;

    const original =
        calculatePrice();

    const discount =
        couponApplied && original > 0
        ? COUPON_DISCOUNT
        : 0;

    const finalPrice =
        Math.max(
            0,
            original - discount
        );


    document.getElementById(
        "dhSelected"
    ).textContent =
        `${count} ${
            count === 1
            ? "category"
            : "categories"
        }`;


    document.getElementById(
        "dhPackage"
    ).textContent =
        packageName();


    document.getElementById(
        "dhBadge"
    ).textContent =
        packageName() === "—"
        ? "Select"
        : packageName();


    document.getElementById(
        "dhOriginal"
    ).textContent =
        money(original);


    document.getElementById(
        "dhDiscount"
    ).textContent =
        `- ${money(discount)}`;


    document.getElementById(
        "dhTotal"
    ).textContent =
        money(finalPrice);


    const chips =
        document.getElementById(
            "dhChips"
        );

    chips.innerHTML = "";


    selectedCourseIds.forEach(id=>{

        const course =
            courses.find(
                c => c.id === id
            );

        if(!course)
            return;

        chips.appendChild(
            el("div",{
                className:"dh-chip",
                text:course.name
            })
        );

    });


    document.getElementById(
        "dhProceed"
    ).disabled =
        count === 0;
}


/* =========================================================
   COUPON
========================================================= */

function applyCoupon(){

    const input =
        document.getElementById(
            "dhCoupon"
        );

    const message =
        document.getElementById(
            "dhCouponMsg"
        );

    const code =
        input.value
            .trim()
            .toUpperCase();


    if(!code){

        couponApplied = false;

        message.textContent =
            "Enter a coupon code.";

        message.style.color =
            "#ff9baa";

        updateSummary();

        return;
    }


    if(code === COUPON_CODE){

        couponApplied = true;

        message.textContent =
            "Coupon applied successfully. ৳50 discount.";

        message.style.color =
            "#71e8c0";

    }else{

        couponApplied = false;

        message.textContent =
            "Invalid coupon code.";

        message.style.color =
            "#ff9baa";

    }


    updateSummary();
}


/* =========================================================
   CHECKOUT
========================================================= */

async function proceed(){

    if(!currentUser){

        showMessage(
            "Please login first."
        );

        return;
    }


    if(!selectedCourseIds.length){

        showMessage(
            "Please select at least one category."
        );

        return;
    }


    const roll =
        document.getElementById(
            "dhHscRoll"
        ).value.trim();


    const registration =
        document.getElementById(
            "dhHscRegistration"
        ).value.trim();


    if(!roll){

        showMessage(
            "Please enter your HSC roll."
        );

        return;
    }


    if(!registration){

        showMessage(
            "Please enter your HSC registration."
        );

        return;
    }


    const originalAmount =
        calculatePrice();


    const discount =
        couponApplied
        ? COUPON_DISCOUNT
        : 0;


    const finalAmount =
        Math.max(
            0,
            originalAmount - discount
        );


    const checkout = {

        userId:
            currentUser.id,

        email:
            currentUser.email || "",

        courseIds:
            [...selectedCourseIds],

        packageType:
            packageName(),

        originalAmount,

        couponCode:
            couponApplied
            ? COUPON_CODE
            : "",

        discount,

        finalAmount,

        hscRoll:
            roll,

        hscRegistration:
            registration,

        hscYear:
            document.getElementById(
                "dhHscYear"
            ).value.trim(),

        board:
            document.getElementById(
                "dhBoard"
            ).value.trim(),

        createdAt:
            new Date().toISOString()

    };


    /*
       This data is only checkout information.

       The backend/payment system MUST recalculate
       course price and coupon validity.
    */

    sessionStorage.setItem(
        "dreamHuntCheckout",
        JSON.stringify(checkout)
    );


    /* Compatibility */

    sessionStorage.setItem(
        "selectedCourses",
        JSON.stringify(
            selectedCourseIds
        )
    );

    sessionStorage.setItem(
        "packageType",
        packageName()
    );

    sessionStorage.setItem(
        "originalAmount",
        String(originalAmount)
    );

    sessionStorage.setItem(
        "couponCode",
        couponApplied
        ? COUPON_CODE
        : ""
    );

    sessionStorage.setItem(
        "discount",
        String(discount)
    );

    sessionStorage.setItem(
        "finalAmount",
        String(finalAmount)
    );

    sessionStorage.setItem(
        "hscRoll",
        roll
    );

    sessionStorage.setItem(
        "hscRegistration",
        registration
    );


    const button =
        document.getElementById(
            "dhProceed"
        );

    button.disabled = true;

    button.textContent =
        "Opening Payment...";


    window.location.href =
        "payment.html";
}


/* =========================================================
   QUERY PLAN
========================================================= */

function applyQueryPlan(){

    const params =
        new URLSearchParams(
            window.location.search
        );

    const plan =
        params.get("plan");

    if(!plan)
        return;


    if(plan === "all"){

        selectedCourseIds =
            courses.map(
                c => c.id
            );

        updateCourseCards();
        updateSummary();

        return;
    }


    const planWords = {

        public:[
            "public",
            "public-university"
        ],

        engineering:[
            "engineering"
        ],

        medical:[
            "medical",
            "medical-dental"
        ],

        dual:[
            "medical",
            "engineering"
        ]

    };


    const wanted =
        planWords[plan];


    if(!wanted)
        return;


    const matches =
        courses.filter(course=>{

            const slug =
                String(
                    course.slug || ""
                ).toLowerCase();

            return wanted.includes(slug);

        });


    selectedCourseIds =
        matches.map(
            c => c.id
        );


    updateCourseCards();
    updateSummary();
}


/* =========================================================
   EVENTS
========================================================= */

function bindEvents(){

    document
        .getElementById(
            "dhApplyCoupon"
        )
        .addEventListener(
            "click",
            applyCoupon
        );


    document
        .getElementById(
            "dhCoupon"
        )
        .addEventListener(
            "keydown",
            event=>{

                if(event.key === "Enter"){

                    event.preventDefault();

                    applyCoupon();

                }

            }
        );


    document
        .getElementById(
            "dhProceed"
        )
        .addEventListener(
            "click",
            proceed
        );
}


/* =========================================================
   INIT
========================================================= */

async function initDreamHuntBuy(){

    try{

        addStyles();

        buildPage();


        if(!window.supabase){

            const script =
                document.createElement("script");

            script.src =
                "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

            await new Promise(
                (resolve,reject)=>{

                    script.onload =
                        resolve;

                    script.onerror =
                        reject;

                    document.head.appendChild(
                        script
                    );

                }
            );
        }


        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );


        const loggedIn =
            await checkAuth();

        if(!loggedIn)
            return;


        bindEvents();


        await Promise.all([
            loadCourses(),
            loadStudentProfile()
        ]);


        applyQueryPlan();

        updateSummary();


    }catch(error){

        console.error(
            "Dream Hunt Buy Courses:",
            error
        );

        showMessage(
            "Unable to load Buy Courses. Please refresh the page."
        );

    }
}


/* =========================================================
   START
========================================================= */

if(
    document.readyState === "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        initDreamHuntBuy
    );

}else{

    initDreamHuntBuy();

}

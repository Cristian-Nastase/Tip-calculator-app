const bill = document.getElementById("bill");
const tipInputs = document.getElementsByClassName("tip__input");
const customTip = document.getElementById("custom-tip");
const peopleInput = document.getElementById("people");

const form = document.getElementById("form");

const tipResult = document.getElementById("tip-result");
const totalResult = document.getElementById("total-result");

let lastPercentageValue;

function calculate(billValue, people)
{
    const tipSum = (lastPercentageValue / 100) * billValue;
    const totalSum = billValue + tipSum;

    const tipAmountPerPerson = (tipSum / people).toFixed(2);
    const totalAmountPerPerson = (totalSum / people).toFixed(2);
    return { tipAmountPerPerson, totalAmountPerPerson};        
}

function parseFormData(event)
{
    const billValue = bill.value ? parseFloat(bill.value) : 0;
    if(!billValue || billValue < 0) throw Error("Requires bill to calculate");

    if(event.target?.getAttribute("name").includes("tip"))
        {
            // dont allow multiple tipping percentage options to be simultaneously active
            if(event.target.getAttribute("type") === "text")
                {
                    event.target.dataset.tipAmount = event.target.value;
                    uncheckTipInputs();
                }
            else
                {
                    customTip.value = "";
                }
            lastPercentageValue = parseFloat(event.target.dataset.tipAmount);
        } 
    if(!lastPercentageValue) throw Error("Requires tip percentage selected");

    const people = peopleInput.value ? parseFloat(peopleInput.value) : 0;
    if(!people || people < 0) throw Error("Requires people to split bill");

    return { billValue, people };
}

function changeEventHandler(event)
{
    try
    {
        const { billValue, people } = parseFormData(event);

        const { tipAmountPerPerson, totalAmountPerPerson } = calculate(billValue, people);

        tipResult.textContent = `$${tipAmountPerPerson.toString()}`;
        totalResult.textContent = `$${totalAmountPerPerson.toString()}`;
    }
    catch(error){
        resetResults();
        console.error(error);
    }
}

form.addEventListener("input", function(event)
{
    changeEventHandler(event);
});

function uncheckTipInputs()
{
    for(let i = 0; i < tipInputs.length; i++)
        tipInputs[i].checked = false;
}

function resetResults()
{
    tipResult.textContent = "$0.00";
    totalResult.textContent = "$0.00";
}
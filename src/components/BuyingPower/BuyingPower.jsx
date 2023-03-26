import { useRef, useState } from "react";
import * as usersAPI from "../../utilities/users-api";

export default function BuyingPower({ user, setUser }) {
    const amountRef = useRef('');
    const disableRef = useRef(true);
    const [amount, setAmount] = useState('');

    function toggleSection() {
        document.getElementById("buying-power-section").classList.toggle("show-section");
    }

    function toggleModal(evt) {
        // Guard. Prevent this evt from propagating to the window.onclick event listener
        evt.stopPropagation();
        document.getElementsByClassName("modal")[0].classList.toggle("show-modal");
    }
    
    window.onclick = function(evt) {
        // if the clicked element is not child of the form element nor the form element
        // remove show-modal class
        if (!evt.target.closest('.deposit-form')) {
            var modal = document.getElementsByClassName('modal')[0];
            if (modal.classList.contains("show-modal")) {
                modal.classList.remove("show-modal");
            }
        }
        // Also check if the clicked element matches the dropbtn. If not, remove show class
        if (!evt.target.matches('.dropbtn')) {
            var dropdown = document.getElementsByClassName("dropdown-content")[0];
            if (dropdown.classList.contains('show')) {
              dropdown.classList.remove('show');
            }
        }
    }

    function handleChange(evt) {
        amountRef.current = (evt.target.value);
        console.log(disableRef.current)
        setAmount(evt.target.value);
    }

    async function handleDeposit(evt) {
        evt.preventDefault();
        // check if the amount input is valid (cannot be empty and cannot be more than 3 digits)
        disableRef.current = !/^\d+(\.\d{1,2})?$/.test(amountRef.current);
        console.log("Amount entered:", amountRef.current);
        console.log("Dsiable:", disableRef.current);
        if (!amountRef.current) {
            alert('Amount cannot be empty');
            return;
        } 
        if (disableRef.current) {
            alert('Amount cannot be more than 2 decimal digits');
            return;
        }
        // when the input is valid, update the user's balance
        const updatedUser = await usersAPI.deposit(parseFloat(amountRef.current));
        setUser(updatedUser);
        setAmount('');
        // remove show-modal class
        document.getElementsByClassName('modal')[0].classList.remove("show-modal");
    }

    return (
        <>
            <div className="buying-power-container" onClick={toggleSection}>
                <div className="buying-power-content">
                    <p>Buying Power</p><p>${user.balance}</p>
                </div>
                <div id="buying-power-section">
                    <div className="left-section">
                        <div className="buying-power-content">
                            <p>Brokerage Cash</p><p>${user.balance}</p>
                        </div>
                        <div className="buying-power-content">
                            <p>Buying Power</p><p className="bold-font">${user.balance}</p>
                        </div>
                        <button className="show-modal-btn" onClick={toggleModal}>Deposit Funds</button>
                    </div>
                    <div className="right-section">
                        <p>Buying power represents the total value of assets you can purchase. </p>
                    </div>
                </div>
            </div>
            <div className="modal">
                <form className="deposit-form">
                    <span>Deposit Money</span>
                    <div className="deposit-form-content">
                        <label>Amount</label>
                        <input type="number" placeholder="$0.00" value={amount} name="amount" step="0.01" required pattern="\d+(\.\d{1,2})?" onChange={handleChange}/>
                    </div>
                    <div className="deposit-form-content">
                        <label>To</label>
                        <select>
                            <option value="Brokerage">Brokerage</option>
                        </select>
                    </div>
                    <div className="deposit-form-content">
                        <label>Currency</label>
                        <select>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                    <button onClick={handleDeposit}>Confirm Deposit</button>
                </form>
            </div>
        </>
    )
}
import { useEffect } from "react";

export default function LearnInvesting() {
    function scrollLeft() {
        const container = document.querySelector('.cards-container');
        container.scrollBy({ left: -450, behavior: 'smooth' });
    }

    function scrollRight() {
        const container = document.querySelector('.cards-container');
        container.scrollBy({ left: 450, behavior: 'smooth' });
    }

    useEffect(() => {
        const container = document.querySelector('.cards-container');
        const leftBtn = document.querySelector('.card-scroll-left-btn');
        const rightBtn = document.querySelector('.card-scroll-right-btn');
    
        function handleScroll() {
          if (container.scrollLeft === 0) {
            leftBtn.style.display = 'none';
          } else {
            leftBtn.style.display = 'flex';
          }
          // clientWidth gives the width of the visible area of the container.
          // Hence if scrollLeft + clientWidth = scrollWidth then it reaches the right edge
          if (container.scrollLeft + container.clientWidth === container.scrollWidth) {
            rightBtn.style.display = 'none';
          } else {
            rightBtn.style.display = 'flex';
          }
        }
        
        container.addEventListener('scroll', handleScroll);
        // cleanup function. remove the event listener when component unmounts
        // That is, when navigate to different page or when component is removed from DOM
        return () => {
          container.removeEventListener('scroll', handleScroll);
        };
      }, []);

    return (
        <section className="cards-container">
            <button className="card-scroll-left-btn" onClick={scrollLeft}>
                <i className="material-icons">chevron_left</i>
            </button>
            <a className="card card1" href="https://learn.robinhood.com/articles/5rLPuobXWssBWHodCe6M0E/what-is-an-investment/">
                <div className="card-title"><span>What is an investment?</span></div>
                <img src="https://images.ctfassets.net/5ft2qdzfrz9o/1sJVPAVrnWmRrRXR4l8AQQ/de3c4b7ea4825a81e4fda56352f32399/investingmythbusters.png"></img>
            </a>
            <a className="card card2" href="https://learn.robinhood.com/articles/6FKal8yK9kk22uk65x3Jno/what-is-a-stock/">
                <div className="card-title"><span>What is a stock?</span></div>
                <img src="https://images.ctfassets.net/5ft2qdzfrz9o/4UWt3fpE1XDo9SmKhyLrw0/ff8cb0830896445fc6eb4629b30c8a72/whatsthestockmarket.png"></img>
            </a>
            <a className="card card3" href="https://learn.robinhood.com/articles/2oZ3da1LxPhVbsVxk5kVHa/what-is-the-stock-market/">
                <div className="card-title"><span>What is the stock market?</span></div>
                <img src="https://images.ctfassets.net/5ft2qdzfrz9o/LYcBU4NqBr3J1ldjFIaeV/fc7aab5063a8c69289990835c753aee3/whatareyourgoals.png"></img>
            </a>
            <a className="card card4" href="https://learn.robinhood.com/articles/getting-started-with-options/">
                <div className="card-title"><span>Getting started with options</span></div>
                <img src="https://images.ctfassets.net/5ft2qdzfrz9o/1OsFLp4ZRSFOwST38BjyJt/d3aaeeb5fc55d09bced27e57a03140ee/Mask_Group.png"></img>
            </a>
            <a className="card card5" href="https://learn.robinhood.com/articles/a-big-little-primer-on-options/">
                <div className="card-title"><span>A big, little primer on options</span></div>
                <img src="https://images.ctfassets.net/5ft2qdzfrz9o/6vk1E9Ku0BeDVBar5wXOI4/3b22e2e3dd84e277d22480d0627bc97a/whatcanyouinvestin.png"></img>
            </a>
            <a className="card card6" href="https://learn.robinhood.com/articles/risk-management/">
                <div className="card-title"><span>Risk management</span></div>
                <img src="https://images.ctfassets.net/5ft2qdzfrz9o/4icKFtgRgdaNBt8T8ZVwQW/9b8beeecdc05942575d8d10517f3e602/Mask_Group.png"></img>
            </a>
            <a className="card card7" href="https://learn.robinhood.com/articles/4vaR9PkTzes8u3ibLAWrD1/what-is-a-portfolio/">
                <div className="card-title"><span>What is a portfolio?</span></div>
                <img src="https://images.ctfassets.net/5ft2qdzfrz9o/4ueyCVqAj07Ou50NzRYl0T/4339c5432ceeb05c3792c5a01ea52ea0/Mask_Group.png"></img>
            </a>
            <a className="card card8" href="https://learn.robinhood.com/articles/QkpPOCYYd2fMe76837dvG/what-is-an-exchange-traded-fund/">
                <div className="card-title"><span>What is an ETF?</span></div>
                <img src="https://images.ctfassets.net/5ft2qdzfrz9o/4l9x1TPE2FafOAoQRfGL7O/a5b4826f8fc1375e034b8309e2ed67fa/whattoknowaboutcrypto.png"></img>
            </a>
            <a className="card card9" href="https://learn.robinhood.com/articles/6jGOO5O2YvyoZzlEUtIq0F/what-is-a-dividend/">
                <div className="card-title"><span>What is a dividend?</span></div>
                <img src="https://images.ctfassets.net/5ft2qdzfrz9o/7akX96MoZJ6GuU0UYpclbj/c77e25767e21294704030e3cf439f653/Mask_Group__1_.png"></img>
            </a>
            <a className="card card10" href="https://learn.robinhood.com/articles/4goackXsGysEsCqKkd3z2p/what-is-diversification/">
                <div className="card-title"><span>What is diversification?</span></div>
                <img src="https://images.ctfassets.net/5ft2qdzfrz9o/2zOIiqO3303DrQtVEHVa72/c0fad7a8e97f0fce1788a8cee1241bba/TLH-Lesson-Card.png"></img>
            </a>
            <button className="card-scroll-right-btn" onClick={scrollRight}>
                <i className="material-icons">chevron_right</i>
            </button>
        </section>
    );
}
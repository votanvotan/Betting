import React, {Component} from 'react';
import {Accordion, Icon} from 'semantic-ui-react';
import configjson from './config.json'
var moment = require('moment');
if (!process.env.REACT_APP_ENVIRONMENT || process.env.REACT_APP_ENVIRONMENT === 'dev') {
    // dev code
    var ip=configjson.testingIP;
} else {
    // production code
    ip=configjson.productionIP;
}
export default class WeekList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contract: null
        };
        this.getContract = this.getContract.bind(this);
        this.updateContract = this.updateContract.bind(this);
    }
    getContract() {
        let self = this;
        // console.log("http://"+configjson.serverIP+":"+configjson.serverPort+"/contract")
        let val = fetch(ip+"/bridge", {
            method: 'GET',
            headers: {
                to: this.props.date,
                from: this.props.date - 604800,
                currentTime: this.props.currentTime
            }
        }).then(function(contracts) {
            if(contracts.status===204){
                self.setState({contract: []})
            }
            else if(contracts.status===200){
            contracts.json().then(function(value) {
                self.setState({contract: value})
                if (value.length > 0 && self.props.number === 0) {
                    if(document.getElementById(value[0].contractid)!==null && document.getElementById(value[0].contractid)!==undefined)
                      document.getElementById(value[0].contractid).classList='bettingOpen '+document.getElementById(value[0].contractid).classList;
                    // console.log(value[0].contractid)
                    self.props.initiate(value[0].contractid)
                }
            })
        }
        })
        return val;
    }
    componentWillMount() {
        this.getContract();
    }
    handleClick = (e, titleProps) => {
        const {index} = titleProps
        // const {activeIndex} = this.props.parentState
        const newIndex = this.props.parentState.state.activeIndex === index? -1: index
        this.props.parentState.setState({activeIndex: newIndex})
    }
    updateContract = (contract)=> {
        this.props.contractUpdate(contract);
    }
    render() {

        if (this.state.contract !== null && this.state.contract.length !== 0) {
            var contractjson = this.state.contract;
            const Buttons = (contractjson.map((row) => {
              if(row.active==="Active"){
                return (<div className={"race live_race " + row.contractid} id={row.contractid} key={row.contractid} onClick={ this.updateContract} style={{textAlign:'left'}} number={this.props.number}>
                    <div className={"date " + row.contractid} number={this.props.number}>{(moment(parseInt(row.date,10) * 1000).format('dddd, DD MMM YYYY')).toString()}
                        <br/>
                        <span className={"hour  " + row.contractid} number={this.props.number}>{(moment(parseInt(row.date,10) * 1000).format('HH:mm')).toString()}</span>
                    </div>
                <div className={"status-race-sidebar " + row.contractid} number={this.props.number}>Status
                    <span className={"status_race_value live " + row.contractid} number={this.props.number}>{row.active}</span>
                </div>
                <div className="duration-race-sidebar"><img src={require("./assets/Orion_hour.png")} className="duration_icon_sidebar" alt=""/>Duration : <span className="duration_race_value">{row.race_duration/3600} hours</span></div>
            </div>)
            }
            else if(row.active==="Open for bets"){
                return (<div className={"race live_race " + row.contractid} id={row.contractid} key={row.contractid} onClick={ this.updateContract} style={{textAlign:'left'}} number={this.props.number}>
                    <div className={"date " + row.contractid} number={this.props.number}>{(moment(parseInt(row.date,10) * 1000).format('dddd, DD MMM YYYY')).toString()}
                        <br/>
                        <span className={"hour  " + row.contractid} number={this.props.number}>{(moment(parseInt(row.date,10) * 1000).format('HH:mm')).toString()}</span>
                    </div>
                <div className={"status-race-sidebar " + row.contractid} number={this.props.number}>Status
                    <span className={"status_race_value open " + row.contractid} number={this.props.number}>{row.active}</span>
                </div>
                <div className="duration-race-sidebar"><img src={require("./assets/Orion_hour.png")} className="duration_icon_sidebar" alt=""/>Duration : <span className="duration_race_value">{row.race_duration/3600} hours</span></div>
            </div>)
            }
            else if(row.active==="Closed"){
                return (<div className={"race closed-race " + row.contractid} id={row.contractid} key={row.contractid} onClick={ this.updateContract} style={{textAlign:'left'}} number={this.props.number}>
                  <div class="raceId"><img class="flag-icon-sidebar" src={require("./assets/flag_icon_sidebar.png")} alt=""/>Race #122</div>
                    <div className={"date " + row.contractid} number={this.props.number}>{(moment(parseInt(row.date,10) * 1000).format('dddd, DD MMM YYYY')).toString()}
                        <br/>
                        <span className={"hour  " + row.contractid} number={this.props.number}>{(moment(parseInt(row.date,10) * 1000).format('HH:mm')).toString()}</span>
                    </div>
                <div className={"status-race-sidebar " + row.contractid} number={this.props.number}>Status
                    <span className={"status_race_value closed " + row.contractid} number={this.props.number}>{row.active}</span>
                </div>
                <div className="duration-race-sidebar"><img src={require("./assets/Orion_hour.png")} className="duration_icon_sidebar" alt=""/>Duration : <span className="duration_race_value">{row.race_duration/3600} hours</span></div>
            </div>)
            }
            else{
                return <div/>;
            }
        }))

            return (<div>
                <Accordion.Title active={this.props.parentState.state.activeIndex === this.props.number} number={this.props.number} index={this.props.number}  onClick={this.handleClick} style={{textAlign:'left',backgroundColor:'#19b5fe'}}>
                    <span style={{textAlign:'left'}} number={this.props.number}><Icon name='dropdown'/> {this.props.title}</span>
                </Accordion.Title>
                <Accordion.Content active={this.props.parentState.state.activeIndex === this.props.number} number={this.props.number} content={Buttons}/>
            </div>);
        }
        return (<div/>)
    }
}

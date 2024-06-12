import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients,
        inProgress: [],
        complete: [],
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
  }

  componentDidMount() {
    const containers = [
      this.swimlanes.backlog.current.querySelector('.Swimlane-dragColumn'),
      this.swimlanes.inProgress.current.querySelector('.Swimlane-dragColumn'),
      this.swimlanes.complete.current.querySelector('.Swimlane-dragColumn')
    ];

    const drake = Dragula(containers);

    drake.on('drop', (el, target, source, sibling) => {
      const clientId = el.getAttribute('data-id');
      const targetStatus = target.closest('.col-md-4').getAttribute('data-status');
      const sourceStatus = source.closest('.col-md-4').getAttribute('data-status');

      if (targetStatus === sourceStatus) {
        this.rearrangeClientsWithinSwimlane(clientId, targetStatus, sibling);
      } else {
        this.updateClientStatus(clientId, targetStatus);
      }
    });
  }

  updateClientStatus(clientId, newStatus) {
    this.setState(prevState => {
        const { clients } = prevState;

        // Find the current status of the client
        let currentStatus;
        let clientDetails;
        for (const status in clients) {
            const client = clients[status].find(client => client.id === clientId)
            if (client){
                currentStatus = status;
                clientDetails = client;
                break;
            }
        }

        const { name, description } = clientDetails

        // Remove the client from the current status
        const updatedClients = clients[currentStatus].filter(client => client.id !== clientId)

        // If the new status is different from the current status,
        // add the client to the new status
        if (currentStatus !== newStatus) {
            updatedClients.push({
                id: clientId,
                // You may need to fetch other details of the client from the previous state
                // based on the clientId
                name: name,
                description: description,
                status: newStatus,
            });
        }

        // Update the state
        return {
            clients: {
                ...clients,
                [currentStatus]: updatedClients,
            },
        };
    });
}



  rearrangeClientsWithinSwimlane(clientId, targetStatus, sibling) {
    this.setState((prevState) => {
      const sourceStatus = Object.keys(prevState.clients).find(key => prevState.clients[key].find(client => client.id === clientId));

      if (sourceStatus === targetStatus) {
        // Rearrange within the same swimlane
        const clients = [...prevState.clients[sourceStatus]];
        const clientIndex = clients.findIndex(client => client.id === clientId);
        const client = clients.splice(clientIndex, 1)[0];

        if (sibling) {
          const siblingId = sibling.getAttribute('data-id');
          const siblingIndex = clients.findIndex(client => client.id === siblingId);
          clients.splice(siblingIndex, 0, client);
        } else {
          clients.push(client);
        }

        return {
          clients: {
            ...prevState.clients,
            [sourceStatus]: clients,
          }
        };
      } else {
        // Move to a different swimlane
        const sourceClients = [...prevState.clients[sourceStatus]];
        const targetClients = [...prevState.clients[targetStatus]];
        const clientIndex = sourceClients.findIndex(client => client.id === clientId);
        const client = sourceClients.splice(clientIndex, 1)[0];

        if (sibling) {
          const siblingId = sibling.getAttribute('data-id');
          const siblingIndex = targetClients.findIndex(client => client.id === siblingId);
          targetClients.splice(siblingIndex, 0, client);
        } else {
          targetClients.push(client);
        }

        return {
          clients: {
            ...prevState.clients,
            [sourceStatus]: sourceClients,
            [targetStatus]: targetClients,
          }
        };
      }
    });
  }

  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix'],
      ['6','Boehm and Sons','Automated Systematic Paradigm'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude'],
      ['10','Romaguera Inc','Managed Foreground Toolset'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: 'backlog', // Set status to 'backlog' for all clients
    }));
  }

  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref} />
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4" data-status="backlog" ref={this.swimlanes.backlog}>
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4" data-status="in-progress" ref={this.swimlanes.inProgress}>
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4" data-status="complete" ref={this.swimlanes.complete}>
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
